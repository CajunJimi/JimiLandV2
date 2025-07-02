# JimiLand Site Changelog

## 2025-07-02 19:05:00 - Ensure Post Pages Use Dark Theme

### Description
Ensured all post pages use the dark theme (black background with white text) as standard, regardless of theme toggle settings on the main site.

### Files Affected
- `posts/hst-letter/index.html` - Added data-theme="dark" attribute
- `posts/billy-and-the-kids/index.html` - Added data-theme="dark" attribute
- `posts/drones/index.html` - Added data-theme="dark" attribute
- `posts/dso-2024/index.html` - Added data-theme="dark" attribute
- `posts/jam-band-new-year-2024/index.html` - Added data-theme="dark" attribute
- `assets/css/post.css` - Added fallback colors for dark theme

### Issues Fixed
- Ensured post pages always display with black background and white text
- Added hardcoded fallback colors to override any theme variables
- Fixed navigation styling in post pages to match dark theme
- Added red accent colors for links and hover states

### Technical Implementation
- Added `data-theme="dark"` to HTML tag in all post pages
- Added fallback colors with `!important` declarations in post.css
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
