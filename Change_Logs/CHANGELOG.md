# JimiLand Site Changelog

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
- CSS variables system for consistent theming across all elements
- JavaScript cycle through themes: Dark → Light → Blue → Dark
- Theme state management with localStorage persistence
- Dynamic icon and tooltip updates
- Applied to main navigation pages (Home, Archive, Portfolio, Gigs)

### User Experience
- Click the theme button in top right to cycle through themes
- Theme preference remembered across browser sessions
- Smooth visual transitions when switching themes
- Accessible with descriptive tooltips

### Reason for Change
User requested a 3-way toggle for different brightness levels to provide viewing options for different lighting conditions and personal preferences.

---

## 2025-07-01 19:50:00 - Remove Browser Tab Tooltip

### Description
Removed the "Music, Gigs & Life" subtitle from the browser tab tooltip, simplifying it to just "JimiLand".

### Files Affected
- `index.html` - Updated page title and meta tags

### Changes Made
- **Page Title**: Changed from "JimiLand - Music, Gigs & Life" to "JimiLand"
- **Open Graph Meta**: Updated og:title to match simplified title
- **Twitter Meta**: Updated twitter:title for consistency
- **Browser Experience**: Removed unwanted tooltip text when hovering over tab

### Reason for Change
User requested removal of the popup tooltip that appeared when hovering over the website tab in the browser.

---

## 2025-07-01 19:45:00 - Simplify Archive to Chronological Article List

### Description
Simplified the archive page to show only articles in chronological order (newest to oldest), removing complex filtering and JavaScript dependencies.

### Files Affected
- `archive/index.html` - Complete restructure to simple article list
- `assets/css/main.css` - Added new archive styling

### Changes Made
- **Content Filtering**: Removed gigs, site updates, and portfolio updates from archive
- **Layout Simplification**: Replaced complex timeline with clean article cards
- **JavaScript Removal**: Eliminated archive.js dependency and filtering system
- **CSS Optimization**: Removed archive.css, added styles to main.css
- **Chronological Order**: Articles listed newest to oldest by date
- **Mobile Responsive**: Improved mobile layout with stacked cards
- **Hover Effects**: Added subtle animations and red accent on hover

### Article Order (Newest to Oldest)
1. Jam Band new year 2024 (January 1, 2025)
2. Billy and the kids (December 30, 2024)
3. Drones (December 30, 2024)
4. HST - Letter (November 9, 2024)
5. DSO - 2024 (November 3, 2024)

### Reason for Change
User requested simplified archive showing only articles chronologically, excluding gigs, site updates, and portfolio updates for better focus and usability.

---

## 2025-01-27 19:35:00 - Fix Portfolio Compactness and Article Content Positioning

### Description
Improved user experience by making portfolio more compact and fixing article content positioning issues.

### Files Affected
- `portfolio/index.html` - Updated hero section structure
- `assets/css/main.css` - Added compact portfolio styles and article positioning fixes
- All post pages - Added article-content class for proper positioning

### Changes Made
- **Portfolio Compactness**: Reduced hero section height to show CajunTools without scrolling
- **Article Positioning**: Fixed navbar overlap issue where content was hidden behind fixed navigation
- **CSS Variables**: Added `--navbar-height: 70px` for consistent spacing calculations
- **Responsive Design**: Improved mobile spacing and layout
- **Container Classes**: Fixed incorrect nav-container references in post pages

### Reason for Change
User feedback indicated that CajunTools project required scrolling to see on portfolio page, and article content was being hidden behind the fixed navigation bar, creating poor user experience.

---

## 2025-01-27 15:30:00 - Fix Navigation Consistency Across Post Pages

### Description
Fixed navigation structure inconsistencies on all article/post pages to match the main site's black theme and mobile functionality.

### Files Affected
- `posts/hst-letter/index.html` - Updated navigation structure and removed footer
- `posts/billy-and-the-kids/index.html` - Updated navigation structure and removed footer
- `posts/drones/index.html` - Updated navigation structure and removed footer
- `posts/dso-2024/index.html` - Updated navigation structure and removed footer
- `posts/jam-band-new-year-2024/index.html` - Updated navigation structure and removed footer

### Changes Made
- **Navigation Structure**: Changed from `container`/`nav-brand` to `nav-container`/`nav-logo` to match main site
- **Mobile Menu**: Added `nav-toggle` elements with hamburger bars for mobile functionality
- **Menu IDs**: Added proper `id="nav-menu"` and `id="nav-toggle"` for JavaScript functionality
- **Footer Removal**: Removed all footer elements from post pages to maintain site-wide consistency
- **Theme Consistency**: Ensures black theme and navbar scroll effects work properly on article pages

### Reason for Change
Post pages had inconsistent navigation structure that prevented proper black theme styling and mobile menu functionality. This fix ensures UI consistency across the entire site.

---

## 2025-01-27 15:45:00 - Fix HTML Validation Errors in DSO 2024 Post

### Description
Fixed HTML structure validation errors by properly wrapping list items in unordered list tags.

### Files Affected
- `posts/dso-2024/index.html` - Fixed list structure for setlists

### Changes Made
- **HTML Structure**: Wrapped all `<li>` elements in proper `<ul>` tags
- **Setlist Organization**: Added proper list containers for Set 1, Set 2, and Encore sections
- **Validation Compliance**: Resolved 40+ HTML lint warnings about orphaned list items
- **Semantic Improvement**: Enhanced document structure for better accessibility

### Reason for Change
HTML validation errors were causing lint warnings and potentially affecting SEO and accessibility. Proper list structure improves semantic meaning and compliance with web standards.

---

## 2025-07-01 19:13:00 - Add CajunTools to Portfolio

### Description
Added CajunTools.site to the portfolio page with proper styling and external link functionality.

### Files Affected
- `portfolio/index.html` - Updated from placeholder to full portfolio with CajunTools project
- `assets/css/main.css` - Added portfolio-specific styling

### Changes Made
- **Portfolio Structure**: Replaced "Coming soon" with proper portfolio grid
- **CajunTools Card**: Added project card with:
  - External link to https://cajuntools.site/
  - Description as "browser-side redactor tool for log files"
  - Tags: JavaScript, Privacy, Logs
  - External link icon
- **Portfolio Styling**: Added CSS for:
  - Portfolio card hover effects (red border, lift animation)
  - External link styling with icon
  - Tag system with hover effects
  - Consistent black theme enforcement

### Visual Features
- 🔗 **External Link**: Opens CajunTools in new tab
- 🏷️ **Tags**: JavaScript, Privacy, Logs with hover effects
- ⚫ **Black Theme**: Consistent with site aesthetic
- 🔴 **Red Accents**: Hover effects and link colors
- ✨ **Animations**: Subtle lift effect on hover

### Reason for Change
User requested to add CajunTools.site to portfolio as a browser-side redactor tool for log files.

---

## 2025-07-01 19:10:00 - Fix Archive Page: Ensure Black Theme Consistency

### Description
Fixed archive page styling inconsistencies to match the site's minimal black theme by removing white timeline markers and enforcing black backgrounds.

### Files Affected
- `assets/css/archive.css` - Updated timeline markers and added theme enforcement

### Changes Made
- **Timeline Markers**: Changed white dots to black with colored borders
- **Post Markers**: Black background with white border
- **Gig Markers**: Red background with red border (maintained for visibility)
- **Site Markers**: Black background with green border
- **Theme Enforcement**: Added `!important` rules to prevent white backgrounds
- **Filter Tabs**: Reinforced transparent backgrounds

### Visual Impact
- ⚫ **Consistent black theme** across entire archive page
- 🔴 **Red accent** maintained for gig markers
- ⚪ **White borders** for post markers (subtle contrast)
- 🚫 **No white backgrounds** anywhere on the page

### Reason for Change
User reported that the archive page had white elements that were inconsistent with the site's minimal black aesthetic.

---

## 2025-07-01 19:05:00 - Fix Navbar Scroll Effect: Eliminate White Background

### Description
Fixed critical navbar scroll behavior that was changing the navigation to white backgrounds when scrolling, breaking the minimal black theme.

### Files Affected
- `assets/js/main.js` - Modified navbar scroll effect function

### Changes Made
- **Black Background on Scroll**: Changed navbar scroll effect from white to black backgrounds
- **Consistent Theme**: Navigation now maintains black theme when scrolling
- **Red Shadow Effect**: Added subtle red shadow when scrolled for visual depth
- **Smooth Transition**: Preserved smooth scroll transition behavior

### Technical Details
- Changed `rgba(255, 255, 255, 0.98)` to `rgba(0, 0, 0, 0.98)`
- Updated box-shadow to use red accent: `rgba(255, 0, 0, 0.1)`
- Maintains transparency for modern glass effect

### Reason for Change
User reported that the menu was moving and becoming compacted with white backgrounds when scrolling, which broke the site's minimal black aesthetic.

---

## 2025-07-01 18:49:00 - Fix Gigs: Remove Notion Links & White Backgrounds

### Description
Fixed critical UX issues with gigs page - removed Notion redirects and eliminated white background boxes for clean minimal design.

### Files Affected
- `assets/js/gigs-loader.js` - Removed Notion URL click handlers
- `assets/css/main.css` - Added gig-card specific styling to prevent white backgrounds

### Changes Made
- **Notion Links Removed**: Gig cards no longer redirect to Notion when clicked
- **White Background Fix**: Added CSS rules to ensure gig cards have black backgrounds only
- **Clean UI**: Eliminated gray/white placeholder boxes from gig cards
- **Improved UX**: Users stay on site instead of being redirected to Notion

### Reason for Change
User reported that clicking gigs redirected to Notion (unwanted) and white background boxes were breaking the minimal black theme.

---

## 2025-07-01 18:26:00 - Gigs Data Update & Footer Removal

### Description
Synced latest gigs data from Notion table and removed all footers from site for cleaner minimal design.

### Files Affected
- `data/gigs.json` - Updated with 34 gigs from Notion
- `data/posts.json` - Refreshed posts data
- All HTML files - Removed footer sections

### Changes Made
- **Gigs Data**: Synced 34 gigs including Billy Strings, Bob Weir & Wolf Bros, Dark Star Orchestra
- **Footer Removal**: Eliminated 225 lines of footer code across 11 files for ultra-clean design
- **Auto-deployment**: Confirmed GitHub Pages auto-deployment working

### Reason for Change
User updated gigs table in Notion and requested footer removal for cleaner minimal aesthetic.

---

## 2025-06-28 19:16:00 - Final Documentation & Site Completion

### Description
Completed comprehensive documentation and finalized site for production use. Added complete README, usage guide, and all necessary commands for ongoing content management.

### Added
- **README.md**: Complete setup, usage, and maintenance guide
- **USAGE_GUIDE.md**: Daily workflow and command reference
- **Production documentation**: All commands, troubleshooting, and customization guides

### Site Status - PRODUCTION READY ✅
- ✅ Gigs Page: Calendar and list views with proper artist display
- ✅ Artist Field Integration: Bob Weir and other artists display correctly  
- ✅ Date Filtering: Proper upcoming/past gig categorization
- ✅ Notion CMS Integration: Full sync script with posts and gigs
- ✅ Static Site Deployment: GitHub Pages ready
- ✅ Mobile Responsive: Works on all devices
- ✅ Clean Minimal Design: Black/white theme with red accents

### Key Commands for Future Use
```bash
# Sync content from Notion
node scripts/notion-sync.js

# Test locally  
python3 -m http.server 8000

# Deploy to GitHub Pages
git add . && git commit -m "Content update" && git push
```

### Files Affected
- `/README.md` - Comprehensive setup and maintenance guide
- `/USAGE_GUIDE.md` - Daily workflow and command reference
- `/Change_Logs/CHANGELOG.md` - Final documentation entry

---

## 2025-06-28 18:48:00 - Added Calendar View to Gigs Page

### Description
Implemented calendar view for gigs page with interactive calendar, proper date sorting, and undated gigs section.

### Files Affected
- `/gigs/index.html` - Added calendar container and view switching tabs
- `/assets/css/main.css` - Added calendar styles with minimal black/white theme
- `/assets/js/gigs-loader.js` - Added calendar functionality and view switching

### Reason for Change
User requested calendar view similar to provided image with gigs mapped on calendar, sorted most recent to oldest, with undated gigs at bottom.

### Features Added
- List/Calendar view toggle buttons
- Interactive calendar with month navigation
- Gigs displayed on calendar dates with color coding (red for upcoming, gray for past)
- Undated gigs section at bottom of page
- Proper date sorting (most recent first, undated at end)
- Calendar legend showing gig status colors
- Mobile responsive calendar design

---

## 2025-06-28 18:42:00 - Gigs and Archive System Fixes

### Description
Fixed critical issues preventing gigs page and archive page from loading properly. Resolved DOM selector conflicts and script loading conflicts.

### Files Affected
- `/assets/js/gigs-loader.js` - Fixed DOM selector from `.gigs-grid` to `#gigs-grid`
- `/archive/index.html` - Removed conflicting `archive-loader.js` script
- `/assets/js/archive.js` - Fixed initialization order by moving `init()` call to proper location

### Reason for Changes
- Gigs page was not displaying content due to incorrect CSS selector in JavaScript
- Archive page had two competing JavaScript files causing initialization conflicts
- Both pages now properly load and display real data from JSON files without dummy data fallbacks

---

## 2025-06-28 18:35:00 - Site Cleanup and Archive System Enhancement

### Description
Completed comprehensive site cleanup by removing all dummy data and implementing real data loading for the archive system. Fixed broken post links and enhanced the archive page to use actual Notion CMS data.

### Files Affected
- `/assets/js/archive.js` - Updated to load real data from JSON files instead of dummy data
- `/data/posts.json` - Removed "Test 1" dummy post
- `/data/gigs.json` - Completely replaced with clean, minimal real gigs data
- `/assets/js/posts-loader.js` - Removed getSamplePosts fallback method
- `/assets/js/gigs-loader.js` - Removed getSampleGigs fallback method
- `/posts/test-1/` - Removed dummy post directory

### Reason for Change
The site contained extensive dummy data that was confusing users and breaking the archive functionality. The archive system was using hardcoded sample data instead of loading from the actual Notion CMS data files. This cleanup ensures all content displayed is real and properly linked.

### Key Improvements
1. **Archive System**: Now loads real posts and gigs data from JSON files
2. **Data Integrity**: Removed all dummy/sample data site-wide
3. **Link Fixes**: Corrected post URLs to use `/posts/` instead of `/blog/`
4. **Gigs Display**: Clean gigs data with proper venue and location information
5. **Error Handling**: Improved error handling without fallback to dummy data

### Technical Details
- Archive.js now uses async/await to load real data from posts.json and gigs.json
- Removed all getSample* methods from loader classes
- Updated data filtering to show only recent/upcoming gigs (last 6 months)
- Fixed JSON syntax errors in gigs.json
- Maintained chronological sorting (newest first) for archive timeline

---

## 2024-12-30 18:25:00 - Fixed Notion Content Fetching Issue

### Description
Resolved the critical issue where blog post pages were showing empty content despite having content in Notion. The problem was that the Notion database structure uses a "Content" property that contains URLs to separate Notion pages where the actual blog content is stored.

### Files Affected
- `scripts/notion-sync.js` - Updated content fetching logic to use content URLs
- `debug-content.js` - Created comprehensive debugging script

### Technical Changes
1. **Updated `convertNotionPageToPost` function:**
   - Added extraction of `content_url` from the "Content" property
   - Updated excerpt to use "Description" field as fallback

2. **Modified content fetching logic:**
   - Extract page ID from the content URL instead of using database entry ID
   - Fetch content blocks from the actual content pages
   - Added comprehensive logging for debugging

### Reason for Change
The original sync script was trying to fetch content blocks from the database entry pages instead of the actual content pages linked in the "Content" property. This resulted in empty pages because database entries don't contain content blocks.

### Outcome
- ✅ "Drones" post: 53 blocks, 3786 characters
- ✅ "Billy and the kids" post: 32 blocks, 1396 characters  
- ✅ "HST - Letter" post: 25 blocks, 7828 characters
- ✅ "DSO - 2024" post: 56 blocks, 1633 characters
- Blog posts now display full rich content from Notion
- Local navigation working correctly

---

## 2025-06-28 18:20:00 - Blog Post HTML Pages Generation

### Description
Implemented full blog post page generation from Notion content. Blog posts now create individual HTML pages on the site instead of linking to Notion.

### Files Affected
- `/scripts/notion-sync.js` - Added page content fetching and HTML generation
- `/assets/css/post.css` - Created minimal styling for blog post pages
- `/assets/js/posts-loader.js` - Updated to link to local pages instead of Notion
- `/posts/*/index.html` - Generated individual HTML pages for each blog post

### Changes Made
1. **Content Fetching:**
   - Added `fetchPageContent()` function to get full Notion page content
   - Added `convertBlocksToHTML()` to convert Notion blocks to HTML
   - Added `createPostHTML()` to generate complete HTML pages

2. **Page Generation:**
   - Creates `/posts/{slug}/index.html` for each published post
   - Includes full content, metadata, navigation, and styling
   - Maintains minimal black/white theme consistency

3. **Navigation Updates:**
   - Posts now link to local pages (`/posts/{slug}/`) instead of Notion
   - Added "Back to Home" navigation on post pages
   - Removed external Notion links from post cards

4. **Content Support:**
   - Paragraphs, headings (H1-H3), lists, quotes, code blocks
   - Proper HTML structure with SEO meta tags
   - Mobile-responsive design

### Generated Pages
- `/posts/test-1/` - Test 1
- `/posts/jam-band-new-year-2024/` - Jam Band new year 2024
- `/posts/drones/` - Drones
- `/posts/billy-and-the-kids/` - Billy and the kids
- `/posts/hst-letter/` - HST - Letter
- `/posts/dso-2024/` - DSO - 2024

### Reason for Change
Provides proper blog functionality with individual post pages hosted on the site, improving SEO and user experience while maintaining Notion as content source.

## [2025-06-28] - Gigs Page Fixes & Artist Field Addition

### Fixed
- **Removed unwanted booking section**: Eliminated the white "Book a Performance" bar that was appearing on the gigs page
- **Fixed date filtering**: Updated gig filtering to use date-only comparison instead of datetime, so today's gigs show as "upcoming" instead of "past"
- **Improved gig display**: When gigs have generic "Untitled Gig" titles, now displays venue name as the title instead
- **Eliminated duplicate venue display**: Venue name no longer shows twice when used as the title

### Added
- **Artist field support**: Added artist field to Notion sync script and gigs display
- **Enhanced gig titles**: Gigs now prioritize artist name over venue name for display titles
- **Bob Weir gig now displays properly**: "Bob Weir & the Wolf Bros" shows as title instead of "Untitled Gig"

### Fixed (Calendar View)
- **Calendar gig display**: Fixed calendar to show all gigs instead of only filtered gigs
- **Missing isUpcoming method**: Added proper date comparison method for calendar gig dot colors
- **Calendar artist names**: Calendar now displays artist names when available instead of generic titles

### Files Affected
- `/gigs/index.html` - Removed booking section HTML
- `/assets/js/gigs-loader.js` - Fixed date filtering, added artist support, improved gig display logic
- `/scripts/notion-sync.js` - Added artist field extraction from Notion database

### Reason for Change
- User reported unwanted white bar appearing on gigs page
- Gigs with today's date were incorrectly showing as "past" due to time comparison
- Generic "Untitled Gig" titles were not user-friendly when venue names were available
- Bob Weir gig was not displaying properly due to missing artist field

## 2025-06-28 18:15:00 - Notion CMS Integration Complete

### Description
Completed full Notion CMS integration with dynamic content loading for posts, gigs, and archive. Site now syncs content from Notion databases and displays it dynamically.

### Files Affected
- `/scripts/notion-sync.js` - Updated to handle checkbox Published field for posts and show all gigs
- `/assets/js/gigs-loader.js` - Created dynamic gigs loader from Notion data
- `/assets/js/archive-loader.js` - Created archive integration with Notion content
- `/gigs/index.html` - Updated to use gigs-loader.js
- `/archive/index.html` - Added archive-loader.js integration
- `/data/posts.json` - Generated from Notion (6 published posts)
- `/data/gigs.json` - Generated from Notion (34 gigs)
- `/.env.example` - Added Notion API configuration template

### Changes Made
1. **Notion Integration:**
   - Posts filtered by Published checkbox (6 published posts loaded)
   - All gigs loaded from Notion table (34 gigs)
   - Dynamic content loading on all pages
   - Sync command: `npm run sync`

2. **Content Loaders:**
   - Posts loader: Displays blog posts on homepage
   - Gigs loader: Shows upcoming/past gigs with filtering
   - Archive loader: Integrates Notion content with existing archive

3. **Data Management:**
   - JSON files generated from Notion API
   - Secure API key handling with .env files
   - Error handling and fallback content

### Reason for Change
Provides seamless content management through Notion interface while maintaining static site performance and GitHub Pages compatibility.

### Workflow
1. Edit content in Notion (check Published for blog posts)
2. Run `npm run sync` to fetch latest content
3. Content automatically updates on site

## 2025-06-28 15:19:31 - Site-wide Style Consistency & Navigation Update

### Description
Updated all pages to mirror the minimal home page style, restored red border highlights for navigation, and completely removed the About page and menu item.

### Files Affected
- `/index.html` - Removed About from navigation
- `/gigs/index.html` - Removed About from navigation, simplified page structure
- `/archive/index.html` - Removed About from navigation  
- `/portfolio/index.html` - Removed About from navigation, simplified page structure
- `/assets/css/main.css` - Added red border highlights, filter tab styles, and minimal styling
- `/about/` directory - Completely removed

### Changes Made
1. **Navigation Updates:**
   - Removed "About" menu item from all pages
   - Restored red border highlight (#ff0000) on navigation hover
   - Updated navigation order: Home → Gigs → Archive → Portfolio

2. **Page Structure Consistency:**
   - Gigs page now uses same minimal structure as home page
   - Portfolio page simplified to match home page layout
   - All pages use consistent `main-content` and `latest-posts` sections

3. **Styling Improvements:**
   - Added filter tab styles with minimal white borders
   - Red hover effects on filter tabs
   - Consistent minimal black and white theme across all pages
   - Added styles for "no items" messages

4. **Content Removal:**
   - Completely removed About page directory and all references
   - Simplified page headers and removed complex layouts

### Reason for Change
User requested all pages mirror the home page style for consistency, wanted the red highlight borders restored for better visual feedback, and requested complete removal of the About page as it was not needed.

### Technical Details
- Maintained JavaScript functionality for gigs and archive filtering
- Preserved responsive design across all pages
- Kept minimal black (#000000) background with white (#ffffff) text theme
- All interactive elements use red (#ff0000) accent color for consistency
