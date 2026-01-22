/**
 * layout.js - Shared Header and Footer Rendering
 */

const Layout = {
    /**
     * Renders the shared header into the target element
     * @param {Object} options
     * @param {string} options.rootPath - Relative path to root (e.g. '.' or '..')
     * @param {string} options.activePage - ID of active page (e.g. 'cleanpaste')
     * @param {Array} options.customMenuItems - Array of extra menu objects { label, id, href, onClick }
     */
    renderHeader: function (options) {
        const root = options.rootPath || '.';

        // Navigation Data
        const plugins = [
            { id: 'chrometrack', name: 'ChromeTrack', type: 'extension' },
            { id: 'gocapture', name: 'GoCapture', type: 'extension' },
            { id: 'tubetunnel', name: 'TubeTunnel', type: 'extension' }
        ];

        const webApps = [
            { id: 'cleanpaste', name: 'CleanPaste', appLink: 'cleanpaste/index.html', type: 'webapp' },
            { id: 'tokensqueezer', name: 'Token Squeezer', appLink: 'tokensqueezer/index.html', type: 'webapp' }
        ];

        const headerContainer = document.getElementById('app-header');
        if (!headerContainer) return;

        // Theme Toggle Icon SVG data
        const sunIcon = `<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        // Build Custom Menu Items (e.g., Settings)
        let customMenuHtml = '';
        if (options.customMenuItems) {
            options.customMenuItems.forEach(item => {
                const idAttr = item.id ? `id="${item.id}"` : '';
                const href = item.href || '#';
                customMenuHtml += `<li><a href="${href}" ${idAttr}>${item.label}</a></li>`;
            });
        }

        const isHome = options.activePage !== 'cleanpaste'; // Simple check for now
        const logoPath = options.activePage === 'cleanpaste' ? `${root}/assets/logo.png` : `${root}/assets/logo.png`;

        // Active Class Helpers
        const isActive = (page) => options.activePage === page ? 'active' : '';

        const html = `
        <div class="container">
            <nav class="nav">
                <a href="${root}/index.html" class="logo">
                    <img src="${logoPath}" alt="TrustPlugins Logo" height="32">
                    TrustPlugins
                </a>
                <button class="hamburger-menu" aria-label="Toggle Navigation">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>
                <ul class="nav-links">
                     <li class="dropdown-parent">
                        <a href="${root}/index.html#webapps" class="nav-link ${isActive('webapps')}">Web Apps ▾</a>
                        <ul class="dropdown-menu" id="webapps-dropdown">
                            <!-- Populated by JS -->
                        </ul>
                    </li>
                    <li class="dropdown-parent">
                        <a href="${root}/index.html#plugins" class="nav-link ${isActive('plugins')}">Plugins ▾</a>
                        <ul class="dropdown-menu" id="plugins-dropdown">
                            <!-- Populated by JS -->
                        </ul>
                    </li>
                    <!-- Custom Mobile Menu Items -->
                    ${customMenuHtml}
                    
                    <li><a href="${root}/feedback.html">Feedback</a></li>
                    <!-- Theme Toggle Removed as per request -->
                </ul>
            </nav>
        </div>`;

        headerContainer.innerHTML = html;
        headerContainer.classList.add('header'); // Ensure outer container has class

        this.initMobileMenu();
        this.initThemeToggle();

        // Populate Dropdowns
        this.populateDropdown('plugins-dropdown', plugins, root);
        this.populateDropdown('webapps-dropdown', webApps, root);
    },

    populateDropdown: function (dropdownId, items, root) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        dropdown.innerHTML = ''; // Clear existing
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            if (item.type === 'extension') {
                a.href = `${root}/index.html#plugin-${item.id}`; // Always go to home anchors
            } else {
                a.href = `${root}/${item.appLink || 'index.html'}`;
            }
            // Clean up double slashes if any
            a.href = a.href.replace(/([^:]\/)\/+/g, "$1");

            a.textContent = item.name;
            li.appendChild(a);
            dropdown.appendChild(li);
        });
    },

    /**
     * Renders the shared footer
     */
    renderFooter: function (options) {
        const root = options.rootPath || '.';
        const footerContainer = document.getElementById('app-footer');
        if (!footerContainer) return;

        const html = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>TrustPlugins</h3>
                    <p>Building a better web, one extension at a time.</p>
                </div>
                <div class="footer-links" id="contact">
                    <h4>Connect</h4>
                    <a href="${root}/feedback.html">Feedback</a>
                    <a href="${root}/privacy.html">Privacy Policy</a>
                    <a href="https://github.com/TrustPlugins" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="mailto:contact@trustplugins.com">Email Us</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 TrustPlugins. All rights reserved.</p>
            </div>
        </div>`;

        footerContainer.innerHTML = html;
        footerContainer.classList.add('footer');
    },

    initMobileMenu: function () {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            // Remove old listeners to avoid duplicates if re-rendered
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);

            newHamburger.addEventListener('click', () => {
                newHamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link (unless it's a dropdown parent which might sidebar toggle)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    // If it's the settings toggle, don't close immediately here, let the specific handler do it
                    if (link.id === 'mobile-settings-toggle') return;

                    newHamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    },

    initThemeToggle: function () {
        // Always load saved theme regardless of toggle button presence
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }
};

// Expose Layout globally
window.Layout = Layout;
