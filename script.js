document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Configuration
    const plugins = [
        {
            id: 'chrometrack',
            name: 'ChromeTrack',
            tagline: 'Track time, block distractions, and analyze habits.',
            description: 'Take control of your digital life with ChromeTrack. Visualize your browsing habits with advanced analytics, identify distractions, and reclaim your focus. Features a Circadian Rhythm Map to find your peak hours and a Deep Work Compass.',
            features: [
                'Advanced Analytics & Circadian Maps',
                'Distraction Blocker with Interventions',
                '100% Local Data Storage (No Tracking)'
            ],
            icon: 'assets/icons/chrometrack.png',
            storeLink: 'https://chromewebstore.google.com/detail/chrometrack-web-time-trac/cnomdpgnoiikoffhdfmpkpfjhgcmknle?hl=en&authuser=0',
            type: 'extension'
        },
        {
            id: 'gocapture',
            name: 'GoCapture',
            tagline: 'Free, unlimited 4K screen recording.',
            description: 'Capture your screen, system audio, and microphone without limits. Whether for tutorials, bug reports, or saving calls, GoCapture handles it all in stunning 4K. No watermarks, no sign-ups, and 100% local processing.',
            features: [
                'Unlimited 4K & Full HD Recording',
                'System Audio & Microphone Support',
                'Flexible Modes: Screen, Window, Tab, Cam'
            ],
            icon: 'assets/icons/gocapture.png',
            storeLink: 'https://chromewebstore.google.com/detail/gocapture-free-unlimited/bmfkkbckcamgbhgiheabadjgaidefdmj',
            type: 'extension'
        },
        {
            id: 'tubetunnel',
            name: 'TubeTunnel',
            tagline: 'Hide Shorts, comments, and distractions.',
            description: 'Take back control of your time on YouTube. Hide algorithmic noise, Shorts, comments, and recommendations to focus on what matters.',
            features: [
                'Hide Shorts & Trending',
                'Block Comments & Recommendations',
                'Focus Mode for Video Player'
            ],
            icon: 'assets/icons/tubetunnel.png',
            storeLink: 'https://chromewebstore.google.com/detail/tubetunnel-hide-shorts-co/ccngecmipkielckpekbofkejbgciiopo',
            type: 'extension'
        }
    ];

    const webApps = [
        {
            id: 'cleanpaste',
            name: 'CleanPaste',
            tagline: 'Format and clean your text efficiently.',
            description: 'A simple, powerful tool to clean formatted text, remove whitespace, and prepare content for publishing. Handles various text transformations securely in your browser.',
            features: [
                'Remove Formatting & Styles',
                'Fix Spacing & Punctuation',
                '100% Client-Side Processing'
            ],
            icon: 'assets/logo.png',
            appLink: 'cleanpaste/index.html',
            type: 'webapp'
        }
    ];

    // 2. Render Logic
    const pluginsContainer = document.getElementById('plugins-container');
    const webAppsContainer = document.getElementById('webapps-container');

    if (pluginsContainer) {
        plugins.forEach(plugin => {
            const card = createPluginCard(plugin);
            pluginsContainer.appendChild(card);
        });
    }

    if (webAppsContainer) {
        webApps.forEach(app => {
            const card = createPluginCard(app);
            webAppsContainer.appendChild(card);
        });
    }

    // 3. Navigation Dropdown Population
    populateDropdown('plugins-dropdown', plugins);
    populateDropdown('webapps-dropdown', webApps);

    /**
     * Populates a dropdown menu with items
     * @param {string} dropdownId - The ID of the dropdown container ul
     * @param {Array} items - Array of item objects
     */
    function populateDropdown(dropdownId, items) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            if (item.type === 'extension') {
                a.href = `#plugin-${item.id}`;
                a.onclick = (e) => {
                    // Smooth scroll and expand logic handled by hash change or click
                    handlePluginNavigation(item.id);
                };
            } else {
                a.href = item.appLink;
            }

            a.textContent = item.name;
            li.appendChild(a);
            dropdown.appendChild(li);
        });
    }

    /**
     * Handles navigation to a specific plugin card
     * @param {string} id - The plugin data ID
     */
    function handlePluginNavigation(id) {
        const card = document.getElementById(`plugin-${id}`);
        if (card) {
            // Scroll to view
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Expand card if not already expanded
            if (!card.classList.contains('expanded')) {
                card.classList.add('expanded');
            }
        }
    }

    /**
     * Creates a HTML element for a plugin card or web app card
     * @param {Object} plugin - The plugin data object
     * @returns {HTMLElement} - The fully constructed card element
     */
    function createPluginCard(plugin) {
        // Change from <a> to <div> as the main container
        const article = document.createElement('div');
        article.className = 'plugin-card';
        article.id = `plugin-${plugin.id}`;

        // Add click listener to toggle expanded state
        article.addEventListener('click', () => {
            article.classList.toggle('expanded');
        });

        // Header: Icon + Title + Tagline
        const header = document.createElement('div');
        header.className = 'card-header';

        const img = document.createElement('img');
        img.src = plugin.icon;
        img.alt = `${plugin.name} Icon`;
        img.className = 'plugin-icon';

        const titleGroup = document.createElement('div');
        titleGroup.className = 'plugin-title';

        const h3 = document.createElement('h3');
        h3.textContent = plugin.name;

        const tagline = document.createElement('p');
        tagline.className = 'plugin-tagline';
        tagline.textContent = plugin.tagline;

        titleGroup.appendChild(h3);
        titleGroup.appendChild(tagline);
        header.appendChild(img);
        header.appendChild(titleGroup);

        // Add Expand Icon
        const expandIcon = document.createElement('div');
        expandIcon.innerHTML = `
            <svg class="expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        `;
        header.appendChild(expandIcon);

        // Body: Description + Features
        const body = document.createElement('div');
        body.className = 'card-body';

        const desc = document.createElement('p');
        desc.className = 'plugin-description';
        desc.textContent = plugin.description;

        const featureList = document.createElement('ul');
        featureList.className = 'feature-list';

        plugin.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featureList.appendChild(li);
        });

        body.appendChild(desc);
        body.appendChild(featureList);

        // Footer: Buttons
        const footer = document.createElement('div');
        footer.className = 'card-footer';

        // Change storeBtn to an <a> tag
        const storeBtn = document.createElement('a');
        storeBtn.target = '_blank';
        storeBtn.rel = 'noopener noreferrer';

        if (plugin.type === 'webapp') {
            storeBtn.className = 'btn-web-store btn-webapp'; // Add specific class if needed for styling
            storeBtn.href = plugin.appLink;
            storeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                <span>Open App</span>
            `;
        } else {
            storeBtn.className = 'btn-web-store';
            storeBtn.href = plugin.storeLink;
            storeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5,11H19V7c0-1.1-0.9-2-2-2h-4V3.5C13,2.12,11.88,1,10.5,1S8,2.12,8,3.5V5H4C2.9,5,2,5.9,2,7v4h1.5 c1.38,0,2.5,1.12,2.5,2.5S4.88,16,3.5,16H2v4c0,1.1,0.9,2,2,2h4v-1.5c0-1.38,1.12-2.5,2.5-2.5S13,19.12,13,20.5V22h4 c1.1,0,2-0.9,2-2v-4h1.5c1.38,0,2.5-1.12,2.5-2.5S21.88,11,20.5,11z" />
                </svg>
                <span>Add to Chrome</span>
            `;
        }

        // Prevent click propagation so clicking the button doesn't toggle the card
        storeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        /* 
           Since details button is hidden, we don't strictly need it, 
           but if we were to add it back it should also stop propagation. 
        */

        footer.appendChild(storeBtn);
        // footer.appendChild(detailsBtn); 

        article.appendChild(header);
        article.appendChild(body);
        article.appendChild(footer);

        return article;
    }
});
