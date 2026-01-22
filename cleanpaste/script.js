document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        text: "",
        config: {
            removeZeroWidth: true,
            fixPdf: false,
            removeEmojis: false,
            capsMode: "none",
            appName: "CleanPaste"
        }
    };

    // --- DOM Elements ---
    const textInput = document.getElementById('text-input');
    const clearBtn = document.getElementById('clear-btn');
    const cleanCopyBtn = document.getElementById('clean-copy-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const toast = document.getElementById('toast');

    // --- Mobile Navigation & Sidebar Logic ---
    // Note: Hamburger and NavLinks are handled by layout.js
    // We only need to handle the specific "Settings" toggle which triggers our sidebar.

    // Use event delegation for the dynamically created settings toggle
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'mobile-settings-toggle') {
            e.preventDefault();
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');

            if (sidebar && overlay) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }

            // Layout.js handles closing the nav menu when a link is clicked.
            // But we might need to ensure sidebar opens nicely.
        }
    });

    const sidebar = document.querySelector('.sidebar');

    // Create overlay for sidebar if not exists (though styles might handle it, script created it before)
    // We should create it if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    // Close sidebar on overlay click
    overlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Toggles / Inputs
    const removeHiddenInput = document.getElementById('remove-hidden');
    const fixPdfInput = document.getElementById('fix-pdf');
    const removeEmojisInput = document.getElementById('remove-emojis');
    const capsModeSelect = document.getElementById('caps-mode');

    // Stats
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');

    // --- Initialization ---
    // Load config from localStorage
    loadSettings();
    updateTheme();

    // --- Event Listeners ---
    textInput.addEventListener('input', handleInput);

    // Config Changes
    removeHiddenInput.addEventListener('change', (e) => updateConfig('removeZeroWidth', e.target.checked));
    fixPdfInput.addEventListener('change', (e) => updateConfig('fixPdf', e.target.checked));
    removeEmojisInput.addEventListener('change', (e) => updateConfig('removeEmojis', e.target.checked));
    capsModeSelect.addEventListener('change', (e) => updateConfig('capsMode', e.target.value));

    // Actions
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        handleInput();
        textInput.focus();
    });

    cleanCopyBtn.addEventListener('click', performCleanAndCopy);

    themeToggle.addEventListener('click', toggleTheme);

    // --- Functions ---

    function handleInput() {
        state.text = textInput.value;
        updateStats();
    }

    function updateConfig(key, value) {
        state.config[key] = value;
        saveSettings();
    }

    function updateStats() {
        const text = state.text;
        charCountEl.textContent = text.length;
        wordCountEl.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function updateTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    function saveSettings() {
        localStorage.setItem('cleanPasteConfig', JSON.stringify(state.config));
    }

    function loadSettings() {
        const saved = localStorage.getItem('cleanPasteConfig');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state.config = { ...state.config, ...parsed };

                // Sync UI
                removeHiddenInput.checked = state.config.removeZeroWidth;
                fixPdfInput.checked = state.config.fixPdf;
                removeEmojisInput.checked = state.config.removeEmojis;
                capsModeSelect.value = state.config.capsMode;
            } catch (e) {
                console.error("Failed to load settings", e);
            }
        }
    }

    function performCleanAndCopy() {
        let text = textInput.value;
        const initialLength = text.length;

        // 1. Remove Zero Width Characters
        // \u200B (Zero Width Space), \u200C (ZWNJ), \u200D (ZWJ), \uFEFF (BOM)
        if (state.config.removeZeroWidth) {
            text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
        }

        // 2. Fix PDF Line Breaks
        // Replace single newline with space, but keep double newlines (paragraphs)
        if (state.config.fixPdf) {
            text = text.replace(/([^\n])\n([^\n])/g, '$1 $2');
        }

        // 3. Remove Emojis
        // Broad emoji range regex
        if (state.config.removeEmojis) {
            const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
            text = text.replace(emojiRegex, '');
        }

        // 4. Caps Mode
        if (state.config.capsMode !== 'none') {
            if (state.config.capsMode === 'lower') {
                text = text.toLowerCase();
            } else if (state.config.capsMode === 'upper') {
                text = text.toUpperCase();
            } else if (state.config.capsMode === 'sentence') {
                text = toSentenceCase(text);
            } else if (state.config.capsMode === 'title') {
                text = toTitleCase(text);
            }
        }

        // Update Text Area
        textInput.value = text;
        handleInput(); // sync state

        // Copy to Clipboard
        navigator.clipboard.writeText(text).then(() => {
            const removedCount = initialLength - text.length;
            showToast(removedCount > 0 ? `Copied! Removed ${removedCount} chars` : 'Copied to clipboard!');
        }).catch(err => {
            showToast('Failed to copy');
            console.error('Copy failed', err);
        });
    }

    function toSentenceCase(str) {
        return str.replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) {
            return c.toUpperCase();
        });
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, 3000);
    }
});
