# JimiLand V2 - Personal Blog & Gig Site

A minimal, static website for showcasing blog posts and gig listings, powered by Notion CMS and deployed on GitHub Pages.

## 🚀 Quick Start

### Prerequisites
- Node.js (for Notion sync script)
- Python 3 (for local development server)
- Notion API integration token

### Setup
1. Clone this repository
2. Copy `.env.example` to `.env` and add your Notion credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your Notion API token and database IDs
   ```

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Visit http://localhost:8000
```

## 📝 Content Management

### Syncing from Notion
Update your site content from Notion databases:

```bash
# Sync all content (posts + gigs)
node scripts/notion-sync.js

# This will:
# - Fetch posts from your Notion Posts database
# - Generate individual HTML pages for each post
# - Fetch gigs from your Notion Gigs database
# - Update JSON data files
```

### Notion Database Structure

#### Posts Database Properties:
- **Title** (Title): Post title
- **Date** (Date): Publication date
- **Published** (Checkbox): Whether post is live
- **Description** (Rich Text): Post excerpt
- **Tags** (Multi-select): Post categories
- **Slug** (Rich Text): URL slug
- **Content** (URL): Link to actual content page

#### Gigs Database Properties:
- **Title** (Title): Gig title (can be "Untitled Gig")
- **Artist** (Rich Text): Artist/band name
- **Date** (Date): Gig date
- **Venue** (Rich Text): Venue name
- **Location** (Rich Text): City/location
- **Status** (Select): Draft/Published
- **Type** (Select): Gig type

## 🎯 Site Features

### Pages
- **Home** (`/`): Landing page with recent posts and gigs
- **About** (`/about/`): Personal bio and information
- **Gigs** (`/gigs/`): Interactive gig calendar and list
- **Archive** (`/archive/`): Complete timeline of all content
- **Portfolio** (`/portfolio/`): Project showcase
- **Individual Posts** (`/posts/[slug]/`): Full blog post pages

### Gigs Page Features
- **List/Calendar Views**: Toggle between list and calendar display
- **Filtering**: Upcoming, Past, All gigs
- **Smart Titles**: Shows artist names when available, falls back to venue
- **Date Sorting**: Newest first, proper date handling
- **Interactive Calendar**: Month navigation with color-coded gig dots

## 🛠 Development Commands

### Content Sync
```bash
# Sync content from Notion
node scripts/notion-sync.js

# Check sync status
echo "Posts synced: $(cat data/posts.json | jq length)"
echo "Gigs synced: $(cat data/gigs.json | jq length)"
```

### Local Testing
```bash
# Start development server
python3 -m http.server 8000

# Alternative ports if 8000 is busy
python3 -m http.server 8001
python3 -m http.server 3000
```

### File Structure
```
JimiLandV2/
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript modules
│   └── images/        # Static images
├── data/              # JSON data files
│   ├── posts.json     # Blog posts data
│   └── gigs.json      # Gigs data
├── posts/             # Generated post pages
├── scripts/           # Build and sync scripts
├── Change_Logs/       # Documentation
├── Feature_Logs/      # Feature documentation
└── Troubleshooting_Logs/ # Issue tracking
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
NOTION_API_TOKEN=your_notion_integration_token
NOTION_POSTS_DATABASE_ID=your_posts_database_id
NOTION_GIGS_DATABASE_ID=your_gigs_database_id
```

### Notion Integration Setup
1. Go to https://www.notion.so/my-integrations
2. Create new integration
3. Copy the Internal Integration Token
4. Share your databases with the integration
5. Copy database IDs from database URLs

## 📋 Maintenance Tasks

### Regular Updates
```bash
# 1. Sync latest content
node scripts/notion-sync.js

# 2. Check for any errors
cat Change_Logs/CHANGELOG.md | head -20

# 3. Test locally
python3 -m http.server 8000

# 4. Deploy (if using GitHub Pages, just push to main)
git add .
git commit -m "Content update $(date)"
git push origin main
```

### Troubleshooting
```bash
# Check if Notion API is working
node -e "console.log('Testing Notion connection...'); require('./scripts/notion-sync.js')"

# Validate JSON data
cat data/posts.json | jq . > /dev/null && echo "Posts JSON valid"
cat data/gigs.json | jq . > /dev/null && echo "Gigs JSON valid"

# Check for missing files
ls -la posts/ | wc -l
ls -la data/
```

## 🎨 Customization

### Styling
- Main styles: `assets/css/main.css`
- Archive styles: `assets/css/archive.css`
- Color scheme: Black background, white text, red accents

### JavaScript Modules
- **Posts**: `assets/js/posts-loader.js`
- **Gigs**: `assets/js/gigs-loader.js`
- **Archive**: `assets/js/archive.js`
- **Notion Sync**: `scripts/notion-sync.js`

## 📚 Documentation

### Logs Location
- **Changes**: `Change_Logs/CHANGELOG.md`
- **Features**: `Feature_Logs/FEATURE_LOG.md`
- **Issues**: `Troubleshooting_Logs/TROUBLESHOOTING_LOG.md`

### Key Design Decisions
- **Static Site**: No build process, direct GitHub Pages deployment
- **Notion CMS**: Content managed in Notion, synced via API
- **Minimal Design**: Black/white theme with red accents
- **Mobile First**: Responsive design for all devices
- **Performance**: Lightweight, fast loading

## 🚢 Deployment

### GitHub Pages
1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Site automatically deploys to `https://yourusername.github.io/repository-name`

### Custom Domain
1. Add `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

## 🆘 Support

### Common Issues
1. **Gigs not showing**: Run sync script, check Notion database permissions
2. **Posts missing**: Ensure "Published" checkbox is checked in Notion
3. **Calendar empty**: Verify gig dates are properly formatted in Notion
4. **Sync errors**: Check `.env` file and Notion API token

### Getting Help
- Check `Troubleshooting_Logs/TROUBLESHOOTING_LOG.md`
- Review recent changes in `Change_Logs/CHANGELOG.md`
- Validate Notion database structure matches requirements above

---

**Last Updated**: June 28, 2025
**Version**: 2.0
**Status**: Production Ready ✅
