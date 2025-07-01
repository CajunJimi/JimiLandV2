# JimiLand Site Changelog

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
