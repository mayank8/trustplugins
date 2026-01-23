
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const emptyState = document.getElementById('empty-state');
    const previewContent = document.getElementById('preview-content');
    const previewImg = document.getElementById('preview-img');
    const closeBtn = document.getElementById('close-file');

    // Inputs
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const aspectRatioCheckbox = document.getElementById('aspect-ratio');
    const percentSlider = document.getElementById('percent-slider');
    const percentValue = document.getElementById('percent-value');
    const formatSelect = document.getElementById('format-select');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const qualityWrapper = document.getElementById('quality-wrapper');
    const resizeModeInputs = document.getElementsByName('resize-mode');

    // Actions
    const processBtn = document.getElementById('process-btn');
    const downloadLink = document.getElementById('download-link');
    const resultFooter = document.getElementById('result-footer');

    // Info
    const filenameDisplay = document.getElementById('filename');
    const originalDimsDisplay = document.getElementById('original-dims');
    const newDimsDisplay = document.getElementById('new-dims');
    const newSizeEstDisplay = document.getElementById('new-size-est');

    // State
    let currentImage = null; // Image Object
    let originalWidth = 0;
    let originalHeight = 0;
    let currentMode = 'original'; // original, pixels, percentage
    let currentBlob = null;

    // Event Listeners for Upload
    emptyState.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    closeBtn.addEventListener('click', closeFile);

    // Controls Event Listeners
    resizeModeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            currentMode = e.target.value;
            updateRadioStyles();
            recalculateDimensions();
        });
    });

    // Initial style update
    updateRadioStyles();

    function updateRadioStyles() {
        document.querySelectorAll('.radio-item').forEach(item => {
            const input = item.querySelector('input[type="radio"]');
            if (input && input.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    widthInput.addEventListener('input', () => handleDimensionInput('width'));
    heightInput.addEventListener('input', () => handleDimensionInput('height'));

    percentSlider.addEventListener('input', (e) => {
        percentValue.textContent = `${e.target.value}%`;
        recalculateDimensions();
    });

    formatSelect.addEventListener('change', (e) => {
        // Hide quality for PNG (lossless usually)
        if (e.target.value === 'image/png') {
            qualityWrapper.classList.add('hidden');
        } else {
            qualityWrapper.classList.remove('hidden');
        }
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });

    processBtn.addEventListener('click', processImage);


    // Core Functions
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                originalWidth = img.width;
                originalHeight = img.height;

                // Set Defaults
                widthInput.value = originalWidth;
                heightInput.value = originalHeight;

                showPreview(file.name);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showPreview(filename) {
        previewImg.src = currentImage.src;
        filenameDisplay.textContent = filename;
        originalDimsDisplay.textContent = `${originalWidth} x ${originalHeight}`;

        emptyState.classList.add('hidden');
        previewContent.classList.remove('hidden');
        processBtn.disabled = false;

        // Hide previous results
        resultFooter.classList.add('hidden');

        recalculateDimensions();
    }

    function closeFile() {
        currentImage = null;
        fileInput.value = '';
        previewImg.src = '';

        emptyState.classList.remove('hidden');
        previewContent.classList.add('hidden');
        processBtn.disabled = true;
    }

    function handleDimensionInput(changed) {
        if (!currentImage) return;

        if (aspectRatioCheckbox.checked) {
            const aspect = originalWidth / originalHeight;

            if (changed === 'width') {
                const newWidth = parseInt(widthInput.value) || 0;
                heightInput.value = Math.round(newWidth / aspect);
            } else {
                const newHeight = parseInt(heightInput.value) || 0;
                widthInput.value = Math.round(newHeight * aspect);
            }
        }
    }

    function recalculateDimensions() {
        // Determine intended dimensions based on mode but DON'T update inputs if in pixels mode
        // to verify inputs.
        // Actually, trigger updates if switching modes?
    }

    function getTargetDimensions() {
        if (currentMode === 'original') return { w: originalWidth, h: originalHeight };

        if (currentMode === 'pixels') {
            return {
                w: parseInt(widthInput.value) || originalWidth,
                h: parseInt(heightInput.value) || originalHeight
            };
        }

        if (currentMode === 'percentage') {
            const pct = parseInt(percentSlider.value) / 100;
            return {
                w: Math.round(originalWidth * pct),
                h: Math.round(originalHeight * pct)
            };
        }

        return { w: originalWidth, h: originalHeight };
    }

    function processImage() {
        if (!currentImage) return;

        processBtn.textContent = 'Processing...';
        processBtn.disabled = true;

        // Slight delay to allow UI to update
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const dimensions = getTargetDimensions();
            canvas.width = dimensions.w;
            canvas.height = dimensions.h;

            // Draw image to canvas (high quality)
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(currentImage, 0, 0, dimensions.w, dimensions.h);

            const format = formatSelect.value;
            const quality = parseInt(qualitySlider.value) / 100;

            canvas.toBlob((blob) => {
                if (!blob) {
                    alert('Error creating image.');
                    processBtn.textContent = 'Process Image';
                    processBtn.disabled = false;
                    return;
                }

                currentBlob = blob;

                // Update specific UI
                const url = URL.createObjectURL(blob);

                // We don't update preview image to show result because it might look same.
                // We show download link.

                // Update Stats
                newDimsDisplay.textContent = `${dimensions.w} x ${dimensions.h}`;
                newSizeEstDisplay.textContent = `(~${formatBytes(blob.size)})`;

                // Configure Download
                // Configure Download
                const originalName = filenameDisplay.innerText;
                const dotIndex = originalName.lastIndexOf('.');
                const nameWithoutExt = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
                const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
                const outputFilename = `${nameWithoutExt}_pixeltune.${ext}`;

                // Try File System Access API
                if ('showSaveFilePicker' in window) {
                    const handleSave = async () => {
                        try {
                            const handle = await window.showSaveFilePicker({
                                suggestedName: outputFilename,
                                types: [{
                                    description: 'Image File',
                                    accept: { [format]: [`.${ext}`] }
                                }],
                            });
                            const writable = await handle.createWritable();
                            await writable.write(blob);
                            await writable.close();
                        } catch (err) {
                            if (err.name !== 'AbortError') {
                                console.error('Save failed', err);
                                // Fallback to auto-download if picker fails (not cancelled)
                                triggerDownload(url, outputFilename);
                            }
                        }
                    };
                    handleSave();
                } else {
                    // Fallback
                    triggerDownload(url, outputFilename);
                }

                resultFooter.classList.remove('hidden');

                processBtn.textContent = 'Process Image';
                processBtn.disabled = false;

            }, format, quality);
        }, 100);
    }

    function triggerDownload(url, filename) {
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
    }

    function formatBytes(bytes, decimals = 1) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
    }
});
