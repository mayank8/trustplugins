document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');

    // Stats
    const origTokensEl = document.getElementById('orig-tokens');
    const squeezedTokensEl = document.getElementById('squeezed-tokens');
    const savingsEl = document.getElementById('savings-percent');

    // Controls
    const levelInputs = document.querySelectorAll('input[name="level"]');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    // Filters
    const filterUrls = document.getElementById('filter-urls');
    const filterMarkdown = document.getElementById('filter-markdown');
    const filterPunctuation = document.getElementById('filter-punctuation');
    const filterLowercase = document.getElementById('filter-lowercase');

    // --- State ---
    let state = {
        text: '',
        level: 'low',
        filterUrls: false,
        filterMarkdown: false,
        filterPunctuation: false,
        filterLowercase: false
    };

    // --- STOP WORDS ---
    const STOP_WORDS = [
        'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did',
        'of', 'for', 'in', 'on', 'at', 'to', 'from', 'by', 'with', 'about',
        'that', 'this', 'these', 'those', 'it', 'its',
        'and', 'or', 'but', 'so', 'if', 'because', 'as', 'while', 'when'
    ];
    const STOP_WORDS_REGEX = new RegExp(`\\b(${STOP_WORDS.join('|')})\\b`, 'gi');

    // --- Init ---
    // Initialize state from UI
    state.level = document.querySelector('input[name="level"]:checked').value;
    state.filterUrls = filterUrls.checked;
    state.filterMarkdown = filterMarkdown.checked;
    state.filterPunctuation = filterPunctuation.checked;
    state.filterLowercase = filterLowercase.checked;

    // --- Event Listeners ---
    textInput.addEventListener('input', handleInput);

    // Real-time update on level change
    levelInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.level = e.target.value;
            processText(); // Reprocess immediately
        });
    });

    // Real-time update on filters
    const filters = [
        { el: filterUrls, key: 'filterUrls' },
        { el: filterMarkdown, key: 'filterMarkdown' },
        { el: filterPunctuation, key: 'filterPunctuation' },
        { el: filterLowercase, key: 'filterLowercase' }
    ];

    filters.forEach(f => {
        f.el.addEventListener('change', (e) => {
            state[f.key] = e.target.checked;
            processText();
        });
    });

    squeezeBtn.addEventListener('click', processText); // Manual trigger

    copyBtn.addEventListener('click', copyOutput);

    // --- Core Functions ---
    function handleInput() {
        state.text = textInput.value;
        processText();
    }

    function processText() {
        if (!state.text) {
            textOutput.value = '';
            updateStats(0, 0);
            return;
        }

        const squeezed = squeezeText(state.text, state);
        textOutput.value = squeezed;

        const origTokens = estimateTokens(state.text);
        const newTokens = estimateTokens(squeezed);
        updateStats(origTokens, newTokens);
    }

    function estimateTokens(text) {
        if (!text) return 0;
        return Math.ceil(text.length / 4);
    }

    function updateStats(orig, squeezed) {
        origTokensEl.textContent = orig;
        squeezedTokensEl.textContent = squeezed;

        let savings = 0;
        if (orig > 0) {
            savings = ((orig - squeezed) / orig) * 100;
        }

        savingsEl.textContent = `${savings.toFixed(1)}% Saved`;
    }

    // ... (Stop words decl unchanged) ...


    /* ... skipping to squeezeText ... */

    function squeezeText(text, state) {
        let result = text;
        const level = state.level;

        // Custom Filters
        if (state.filterUrls) {
            result = result.replace(/https?:\/\/[^\s]+/g, '');
        }

        if (state.filterMarkdown) {
            result = result.replace(/[#*`_~]/g, ''); // Removes common markdown chars
            result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Removes markdown links but keeps text
        }

        if (state.filterPunctuation) {
            result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, ' ');
        }

        if (state.filterLowercase) {
            result = result.toLowerCase();
        }

        // Level 1: Low (Always Applied)
        result = result.replace(/[ \t]+/g, ' ');
        result = result.replace(/\n{3,}/g, '\n\n');
        result = result.trim();

        if (level === 'advanced') {
            // Level 3: Advanced (Check if JSON)
            try {
                const json = JSON.parse(text);
                return JSON.stringify(json);
            } catch (e) {
                // Not JSON, continue to other optimizations
            }
        }

        if (level === 'aggressive' || level === 'advanced') {
            // Level 2: Aggressive (Stop Words)
            result = result.replace(STOP_WORDS_REGEX, ' ');
            result = result.replace(/[ \t]+/g, ' ').trim();
        }

        if (level === 'advanced') {
            // Level 3: Advanced (Code Minification)
            result = result.replace(/\/\/.*$/gm, '');
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
            result = result.replace(/\s*([\{\}\[\]\(\)=+\-*/;,])\s*/g, '$1');
            result = result.replace(/[ \t]+/g, ' ');
            result = result.replace(/\n+/g, '');
        }

        return result;
    }

    function copyOutput() {
        const text = textOutput.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            showToast();
        });
    }

    function showToast() {
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, 3000);
    }
});
