document.addEventListener('DOMContentLoaded', () => {
    // 1. Plugins Data Configuration
    // To add a new plugin, simply add a new object to this array.
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
            detailsLink: '#'
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
            detailsLink: '#'
        }
    ];

    // 2. Render Logic
    const container = document.getElementById('plugins-container');

    if (container) {
        plugins.forEach(plugin => {
            const card = createPluginCard(plugin);
            container.appendChild(card);
        });
    }

    /**
     * Creates a HTML element for a plugin card
     * @param {Object} plugin - The plugin data object
     * @returns {HTMLElement} - The fully constructed card element
     */
    function createPluginCard(plugin) {
        const article = document.createElement('a');
        article.className = 'plugin-card';
        article.id = `plugin-${plugin.id}`;
        article.href = plugin.storeLink;
        article.target = '_blank';
        article.rel = 'noopener noreferrer';

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

        const storeBtn = document.createElement('div');
        storeBtn.className = 'btn-web-store';
        storeBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H17V15H11V7Z" fill-opacity="0" /> <!-- Fallback icon, Chrome logo usually svg -->
                <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22Z" fill="white"/>
                <path d="M11 7H13V15H11V7Z" fill="white" transform="rotate(270 12 11) translate(-2)"/> 
                <!-- Simple Plus icon for 'Add' -->
                <span>Add to Chrome</span>
            `;

        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn-details';
        detailsBtn.textContent = 'Details';
        detailsBtn.onclick = () => alert(`More details for ${plugin.name} coming soon!`);

        footer.appendChild(storeBtn);
        // footer.appendChild(detailsBtn); // Optional: hidden for now as per requirements asking for minimal MVP

        article.appendChild(header);
        article.appendChild(body);
        article.appendChild(footer);

        return article;
    }
});
