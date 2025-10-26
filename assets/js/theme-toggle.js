/**
 * Simple theme toggle functionality
 * Supports switching between dark and light themes
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create theme toggle button
    createThemeToggle();
    
    // Initialize theme from localStorage
    initializeTheme();
});

/**
 * Create theme toggle button and add to navigation
 */
function createThemeToggle() {
    // Create button element
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('title', 'Toggle theme');
    themeToggle.innerHTML = '☀️';
    themeToggle.style.background = 'transparent';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2rem';
    themeToggle.style.marginLeft = '20px';
    
    // Add click handler
    themeToggle.addEventListener('click', toggleTheme);
    
    // Find nav controls and append toggle
    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
        navControls.insertBefore(themeToggle, navControls.firstChild);
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isLightTheme) {
        // Switch to dark theme
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('title', 'Switch to light theme');
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('title', 'Switch to dark theme');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '🌙';
            themeToggle.setAttribute('title', 'Switch to dark theme');
        }
    } else {
        if (themeToggle) {
            themeToggle.setAttribute('title', 'Switch to light theme');
        }
    }
}
