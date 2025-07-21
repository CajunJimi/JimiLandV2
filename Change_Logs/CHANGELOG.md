# JimiLand Site Changelog

## 2025-07-21 19:15:00 - Remove "Drones" and "Jam Band New Year" Articles

### Description
Completely removed "Drones" and "Jam Band new year 2024" articles from the website as requested by the user.

### Files Affected
- `index.html` - Removed both articles from Latest Posts section
- `archive/index.html` - Removed both articles from chronological archive listing
- `posts/drones/` - Deleted entire directory and contents
- `posts/jam-band-new-year-2024/` - Deleted entire directory and contents

### Reason for Change
User requested to delete these specific articles completely from both homepage and archive sections.

### Changes Made
- Homepage now shows 3 articles instead of 5 in Latest Posts
- Archive chronological listing updated to exclude removed articles
- Physical article files and directories permanently deleted
- Site maintains clean structure with remaining articles: Billy and the kids, HST - Letter, DSO - 2024

## 2025-07-03 18:30:00 - Remove Theme Toggle and Revert to Black Theme

### Description
Removed the theme toggle button from all pages and reverted the site back to its original black theme with fixed styling.

### Files Affected
- `index.html` - Removed theme toggle button from navigation
- `archive/index.html` - Removed theme toggle button from navigation
- `portfolio/index.html` - Removed theme toggle button from navigation
- `gigs/index.html` - Removed theme toggle button from navigation
- `assets/css/main.css` - Removed theme toggle styles and theme variations, keeping only black theme
- `assets/js/main.js` - Removed theme toggle initialization function
- `assets/css/post.css` - Simplified to use fixed black theme
- All post pages - Removed data-theme attributes

### Issues Fixed
- Removed theme toggle button from all pages
- Reverted site to original black theme with white text
- Simplified CSS by removing theme variations
- Removed JavaScript theme toggle functionality
- Ensured consistent black styling across all pages

### Technical Implementation
- Removed theme toggle button HTML from all navigation bars
- Removed theme-related CSS variables and kept only black theme variables
- Removed theme toggle JavaScript functionality
- Removed data-theme attributes from all HTML files
- Simplified CSS to use fixed black theme styling

---

# JimiLand Site Changelog

## 2025-07-02 20:45:00 - Ensure Post Pages Use Dark Theme

### Description
Ensured all post pages use the dark theme (black background with white text) as standard, regardless of theme toggle settings on the main site.

### Files Affected
- `posts/hst-letter/index.html` - Added data-theme="dark" attribute
- `posts/billy-and-the-kids/index.html` - Added data-theme="dark" attribute
- `posts/drones/index.html` - Added data-theme="dark" attribute
- `posts/dso-2024/index.html` - Added data-theme="dark" attribute
- `posts/jam-band-new-year-2024/index.html` - Added data-theme="dark" attribute
- `assets/css/post.css` - Added comprehensive dark theme overrides
- `assets/js/main.js` - Modified theme toggle initialization to force dark theme on post pages

### Issues Fixed
- Ensured post pages always display with black background and white text
- Added hardcoded fallback colors to override any theme variables
- Fixed navigation styling in post pages to match dark theme
- Added red accent colors for links and hover states

### Technical Implementation
- Added `data-theme="dark"` to HTML tag in all post pages
- Added comprehensive CSS variable overrides for all themes in post.css
- Modified JavaScript to detect post pages and force dark theme regardless of localStorage settings
- Added direct element overrides with `!important` declarations for critical UI elements
- Ensured consistent styling for navigation, content, and buttons

---

## 2025-07-01 21:01:00 - Fix Theme Toggle Implementation

### Description
Fixed theme toggle implementation to ensure all elements properly change colors when switching themes. Previously, some page elements remained black in light/blue themes due to hardcoded color values. Removed theme toggle buttons from post pages due to functionality issues.

### Files Affected
- `assets/css/main.css` - Updated all hardcoded colors to use CSS variables with !important declarations
- `assets/css/post.css` - Updated all hardcoded colors to use theme variables
- `posts/hst-letter/index.html` - Removed theme toggle button
- `posts/billy-and-the-kids/index.html` - Removed theme toggle button
- `posts/drones/index.html` - Removed theme toggle button
- `posts/dso-2024/index.html` - Removed theme toggle button
- `posts/jam-band-new-year-2024/index.html` - Removed theme toggle button

### Issues Fixed
- Fixed hardcoded black backgrounds in navbar, hero, post-cards, footer, main-content, latest-posts sections
- Fixed hardcoded white text colors in buttons, nav-links, section-titles, post-titles
- Fixed hardcoded border colors in buttons, filter-tabs, view-tabs, calendar-nav
- Removed theme toggle buttons from post pages due to functionality issues
- Added additional theme variables for card backgrounds and hover states

### Technical Implementation
- Added `!important` declarations to ensure theme variables override existing styles
- Added `--card-bg` and `--hover-bg` variables for better card theming
- Extended theme variable usage to post.css for consistent styling
- Ensured all text, backgrounds, and borders use theme variables

---

## 2025-07-01 20:00:00 - Add 3-Way Theme Toggle

### Description
Implemented a 3-way theme toggle button in the top right of the navigation, allowing users to switch between Dark, Light, and Blue themes.

### Files Affected
- `index.html` - Added theme toggle button to navigation
- `archive/index.html` - Added theme toggle button
- `portfolio/index.html` - Added theme toggle button  
- `gigs/index.html` - Added theme toggle button
- `assets/css/main.css` - Added theme styles and CSS variables
- `assets/js/main.js` - Added 3-way toggle functionality

### Features Added
- **3 Theme Options**:
  - **Dark Theme** (default): White text on black background with red accents
  - **Light Theme**: Black text on white background with dark red accents
  - **Blue Theme**: Dark blue text on off-white background (middle brightness)
- **Theme Toggle Button**: Located in top right with dynamic icons
  - 🌙 for Dark theme
  - ☀️ for Light theme  
  - 🌊 for Blue theme
- **Theme Persistence**: User's theme choice saved in localStorage
- **Smooth Transitions**: 0.3s ease transitions between themes
- **Mobile Responsive**: Optimized button size for mobile devices
- **Comprehensive Styling**: All elements themed consistently

### Technical Implementation
- Added CSS variables for each theme (dark, light, blue)
- Used data-theme attribute on HTML element to control active theme
- Added localStorage for theme persistence
- Created smooth transitions between themes
- Added tooltip for accessibility
- Ensured mobile responsiveness
