# TrustPlugins Website

This is the official landing page for TrustPlugins, hosted on GitHub Pages. It showcases our privacy-first, free browser extensions.

## Project Structure

- `index.html`: The main entry point. Contains the structure of the page.
- `style.css`: All visual styling, variables, and responsive design rules.
- `script.js`: Contains the Data Array (`plugins`) and logic to render cards dynamically.
- `assets/`: Contains images and icons.

## How to Add a New Plugin

You do **not** need to edit HTML to add a new plugin.

1.  Open `script.js`.
2.  Locate the `const plugins = [...]` array at the top of the file.
3.  Add a new object to the array following this format:

```javascript
{
    id: 'new-plugin-id',
    name: 'Plugin Name',
    tagline: 'Short catchy slogan.',
    description: 'Full description of what the plugin does.',
    features: [
        'Feature 1',
        'Feature 2',
        'Feature 3'
    ],
    icon: 'assets/icons/new-icon.png', // Make sure to add the icon to assets/icons/ first!
    storeLink: 'https://chrome.google.com/webstore/...',
    detailsLink: '#'
}
```

The site will automatically render the new card in the grid.

## How to Deploy

This site is designed to be hosted on **GitHub Pages**.

1.  Push the code to the `main` (or `master`) branch of the repository.
2.  Go to the repository Settings on GitHub.
3.  Navigate to the "Pages" section.
4.  Select `main` branch as the Source.
5.  Click Save.

The site will be live at `https://trustplugins.github.io/<repo-name>/`.
