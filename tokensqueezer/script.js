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
    const squeezeBtn = document.getElementById('squeeze-btn');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    // --- State ---
    let state = {
        text: '',
        level: 'low'
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
    // Initialize state from checked radio
    state.level = document.querySelector('input[name="level"]:checked').value;

    // --- Event Listeners ---
    textInput.addEventListener('input', handleInput);

    // Real-time update on level change
    levelInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.level = e.target.value;
            processText(); // Reprocess immediately
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

        const squeezed = squeezeText(state.text, state.level);
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

    function squeezeText(text, level) {
        let result = text;

        // Level 1: Low (Always Applied)
        result = result.replace(/[ \t]+/g, ' ');
        result = result.replace(/\n{3,}/g, '\n\n');
        result = result.trim();

        if (level === 'aggressive') {
            // Level 2: Aggressive (Stop Words)
            result = result.replace(STOP_WORDS_REGEX, ' ');
            result = result.replace(/[ \t]+/g, ' ').trim();
        }

        if (level === 'advanced') {
            // Level 3: Advanced (Code)
            try {
                const json = JSON.parse(text);
                result = JSON.stringify(json);
            } catch (e) {
                result = result.replace(/\/\/.*$/gm, '');
                result = result.replace(/\/\*[\s\S]*?\*\//g, '');
                result = result.replace(/\s*([\{\}\[\]\(\)=+\-*/;,])\s*/g, '$1');
                result = result.replace(/[ \t]+/g, ' ');
                result = result.replace(/\n+/g, '');
            }
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
