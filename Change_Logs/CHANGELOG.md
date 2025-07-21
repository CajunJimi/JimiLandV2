# JimiLand Site Changelog

## 2025-07-21 20:12:00 - Add Song Tracker Integration with Google Sheets

### Description
Added a new Song Tracker section to the gigs page that integrates with Google Sheets to display user's song listening data. The feature includes a searchable table, statistics, and real-time data fetching from Google Sheets.

### Files Affected
- `gigs/index.html` - Added Song Tracker tab and content section with search, stats, and table
- `assets/css/gigs.css` - Added comprehensive CSS styles for song tracker UI components
- `assets/js/song-tracker.js` - Created new JavaScript module for Google Sheets integration
- `assets/js/gigs-loader.js` - Updated to handle song tracker tab switching and content visibility

### Reason for Change
User requested integration with their Google Sheets song tracking data to display song listen counts, when/who/where information on the website.

### Changes Made
- Added "Song Tracker" tab to existing gigs filter tabs
- Created responsive table layout with search functionality
- Implemented Google Sheets CSV parsing and display
- Added statistics cards showing total songs and plays
- Integrated with existing gigs page navigation system
- Configured with user's specific Google Sheets URL (ID: 1EThwk5YmlW-0FHjgm8_ojcWVltHJki1nXCFBcRMdlsc)

### Technical Implementation
- Uses Google Sheets CSV export URL for data fetching
- Implements CORS proxy for cross-origin requests
- Parses CSV data handling quoted values and comma separation
- Provides search/filter functionality across all song data fields
- Mobile-responsive design with optimized table layout

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
- **IMPORTANT**: Removed "Drones" entry from `/data/posts.json` to fix dynamic loading issue
- JavaScript `posts-loader.js` was re-adding "Drones" article after page refresh from JSON data
- Site maintains clean structure with remaining articles: Billy and the kids, HST - Letter, DSO - 2024

## 2025-07-04 22:35:00 - Remove 3-Way Theme Toggle, Revert to Standard Dark Theme

### Description
Removed the 3-way theme toggle functionality and reverted the site back to the standard minimal dark theme design.
>>>>>>> 2c741bd9879ffeebc68c8c5c12f00e4def9980b3

### Files Affected
- `index.html` - Removed theme toggle button from navigation
- `archive/index.html` - Removed theme toggle button from navigation
- `portfolio/index.html` - Removed theme toggle button from navigation
- `gigs/index.html` - Removed theme toggle button from navigation
<<<<<<< HEAD
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
=======
- `assets/css/main.css` - Removed theme variables, toggle styles, and multiple theme definitions
- `assets/js/main.js` - Removed initializeThemeToggle() function and initialization call

### Changes Made
- **Navigation Cleanup**: Removed theme toggle buttons from all navigation areas
- **CSS Simplification**: Eliminated theme variables, toggle styles, and light/blue theme definitions
- **JavaScript Cleanup**: Removed theme toggle functionality and localStorage theme management
- **Visual Consistency**: Restored uniform minimal black and white design across all pages
- **Performance**: Reduced CSS and JavaScript file sizes by removing unused theme code

### Technical Implementation
- Removed `theme-toggle` buttons and associated styling from all HTML pages
- Cleaned up CSS variables and theme-specific styling rules
- Eliminated JavaScript theme switching logic and event handlers
- Maintained existing dark theme as the standard site appearance

### Reason for Change
User requested removal of the 3-way theme toggle to simplify the site design and return to the standard dark theme as the primary visual experience.

---

## 2025-07-04 22:30:00 - Add Documentation Standards

### Description
Added .windsurfrules file to establish comprehensive documentation practices for the project, including changelog, feature logging, and troubleshooting standards.

### Files Affected
- `.windsurfrules` - New documentation standards file

### Features Added
- **Change Log Standards**: Defined structure for CHANGELOG.md entries including timestamp, description, files affected, and reason for change
- **Feature Log Standards**: Established FEATURE_LOG.md documentation for new features and significant updates
- **Troubleshooting Standards**: Set requirements for TROUBLESHOOTING_LOG.md to track issues and resolutions
- **Chat History Archiving**: Guidelines for organizing conversation logs by date/topic
- **Code Style Guidelines**: PEP 8 standards and documentation requirements

### Reason for Change
Establish consistent documentation practices to improve project maintainability, troubleshooting efficiency, and knowledge retention across development cycles.

---

## 2025-07-04 22:25:00 - Merge Production Improvements with Theme System

### Description
Completed merge of local production-ready improvements with remote 3-way theme toggle system, resolving conflicts and combining all recent enhancements.

### Files Affected
- All website files (merge resolution)
- Various CSS, JS, and HTML files from both branches

### Features Combined
- **Archive Simplification**: Chronological article list without complex filtering
- **UI Positioning Fixes**: Portfolio compactness and article content positioning
- **Navigation Consistency**: Unified navbar structure across all post pages
- **3-Way Theme Toggle**: Dark, Light, and Blue theme options with persistence
- **Production Infrastructure**: Complete CMS integration and deployment setup

### Technical Implementation
- Resolved merge conflicts between diverged local and remote branches
- Maintained functionality of all recent improvements
- Ensured consistent styling and navigation across entire site
- Preserved theme toggle functionality with all UI fixes

### Reason for Change
Combine all recent website improvements into a unified, production-ready state while maintaining the enhanced user experience features from both development branches.

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
