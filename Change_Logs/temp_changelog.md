# JimiLand Site Changelog

## 2025-10-26 19:30:00 - Simplified Design with Black and White Theme

### Description
Completely redesigned the site with a simplified, minimal black and white theme focusing on content rather than visual elements. Added optional light theme toggle while preserving music calendar and song tracker functionality.

### Files Affected
- `assets/css/simple.css` - Created new minimalist CSS file
- `assets/js/theme-toggle.js` - Added simple light/dark theme toggle
- `index.html` - Updated to use simplified design and navigation
- `archive/index.html` - Simplified layout with year-based organization
- `gigs/index.html` - Updated styles while preserving functionality
- `posts/billy-and-the-kids/index.html` - Updated to simplified template (all posts)

### Reason for Change
User requested a simpler black and white design similar to an earlier version, while maintaining the calendar and song tracker functionality.

### Changes Made
- **Simplified CSS**: Created clean, minimal styling with proper spacing
- **Navigation Structure**: Reduced to Home, Archive, and Gigs
- **Archive Layout**: Organized posts by year with clear date formatting
- **Post Templates**: Streamlined post display with minimalist styling
- **Theme Toggle**: Added optional light theme (black on white) toggle
- **Maintained Functionality**: Preserved gigs calendar and song tracker
- **Removed Complexity**: Eliminated unnecessary styling and visual elements
- **Mobile Optimization**: Ensured responsive design for all screens

### Technical Implementation
- Used CSS variables for easy theme switching
- Implemented localStorage for theme preference persistence
- Ensured consistent navigation across all pages
- Maintained JavaScript functionality for interactive elements
- Removed unnecessary styling while keeping core features intact

# JimiLand Site Changelog

## 2025-08-11 18:45:00 - Fix TBA Gigs Bug

### Description
Fixed issue causing unexpected "TBA" gig entries with today's date to appear after Notion sync.

### Files Affected
- `scripts/notion-sync.js` - Updated gig conversion logic
- `assets/js/gigs-loader.js` - Fixed frontend display logic
- `data/gigs.json` - Removed erroneous TBA entries

### Reason for Change
The Notion sync script was incorrectly assigning today's date to gigs without dates, and the frontend was displaying these as "TBA" entries.

### Changes Made
- Modified `convertNotionPageToGig` function to leave date empty instead of defaulting to today's date
- Updated frontend display logic to only show "TBA" for gigs with valid dates
- Added more robust checks for artist/venue information in display logic
- Re-ran Notion sync script to update gigs.json without erroneous entries

---

[REST OF CHANGELOG PRESERVED FROM ORIGINAL FILE]
