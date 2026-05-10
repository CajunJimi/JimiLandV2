# JimiLand V2 - Personal Blog & Gig Site

**Personal blog and music tracking website** for showcasing blog posts, gig listings, and concert song tracking. This is a **personal project** documenting musical experiences and thoughts, powered by Notion CMS and deployed on **Cloudflare Workers Static Assets**.

## 🎵 Key Features

- **Blog Posts**: Personal thoughts and experiences
- **Gig Listings**: Upcoming and past concert events
- **Song Tracker**: Interactive database of songs heard at concerts with expandable venue/artist details
- **Responsive Design**: Works on desktop and mobile devices
- **Light + Dark themes**: Warm-neutral palette, OS-following with manual toggle

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

## 🚀 Deployment

### Hosting: Cloudflare Workers Static Assets

The site is hosted on Cloudflare Workers (project name `jimiland`) and
served from Cloudflare's global edge. DNS is on Cloudflare; the domain
is registered at Namecheap (only the nameservers point to Cloudflare).

**Live URL**: `https://jimi.land`
**Worker preview URL**: `https://jimiland.<account>.workers.dev`

### Auto-deploy

Two GitHub Actions handle deployment:

- **`.github/workflows/deploy.yml`** — fires on every push to `main`
  (excluding `[skip ci]` Notion-sync commits and pure docs changes).
  Runs `wrangler deploy` and ships to the edge in ~30 seconds.
- **`.github/workflows/notion-sync.yml`** — runs hourly, fetches from
  Notion, commits any changed JSON/HTML to the repo with `[skip ci]`,
  then runs `wrangler deploy` itself so the new content goes live
  without needing a separate code push to trigger `deploy.yml`.

Both workflows need a `CLOUDFLARE_API_TOKEN` secret on the GitHub repo
(Settings → Secrets and variables → Actions). Create the token at
Cloudflare → My Profile → API Tokens → Create Token → "Edit Cloudflare
Workers" template.

### Manual deploy (CLI fallback)

If the Action is broken or you want to deploy from your laptop:

```bash
npx wrangler@3 login   # one-time
npx wrangler@3 deploy  # uploads + deploys current local files
```

`wrangler.jsonc` at repo root configures the Worker.
`.assetsignore` (same syntax as `.gitignore`) keeps `node_modules/`
and other dev plumbing out of the upload bundle.

### Cloudflare resources used

| Resource | Name | Purpose |
|---|---|---|
| Worker | `jimiland` | Serves the static site |
| R2 bucket | `jimiland-media` | Photo storage (Phase 1 of roadmap) |
| KV namespace | `jimiland-cache` | Geocoding cache (Phase 1 of roadmap) |
| DNS zone | `jimi.land` | Cloudflare-managed |

### Emergency rollback
```bash
# Promote a previous version in the Cloudflare dashboard:
# Workers & Pages → jimiland → Deployments → click "..." on a previous
# version → Promote to active. Reverts the live site in seconds, no git
# operations needed.
```

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
- Main styles: `assets/css/style.css` (token-based, light + dark themes)
- Map styles: `assets/css/map.css`
- Color scheme: warm-neutral palette
  - **Light**: `#f4f2ee` cream bg, `#1c1a17` text, `#b86b2a` accent
  - **Dark**: `#15141a` warm off-black, `#e8e4dd` warm off-white, `#d4915a` accent
  - Both modes share warm undertones; switching theme feels like the same site
- Typography: system serif for headings (`ui-serif`), system sans for
  body, system mono for dates and meta. No external font load.

### JavaScript Modules
- **Posts**: `assets/js/posts-loader.js`
- **Gigs**: `assets/js/gigs-loader.js`
- **Archive**: `assets/js/archive.js`
- **Notion Sync**: `scripts/notion-sync.js`

## 🤖 AI Assistant & Maintainer Handoff

### Before Making Changes
**CRITICAL**: Always review these files first:
1. **README.md** (this file) - Full project overview
2. **Change_Logs/CHANGELOG.md** - All previous modifications
3. **Feature_Logs/FEATURE_LOG.md** - Detailed feature implementations  
4. **Troubleshooting_Logs/TROUBLESHOOTING_LOG.md** - Known issues and solutions
5. **.windsurfrules** - Project-specific documentation requirements

### Project Context
- **Type**: Personal blog and music tracking website
- **Owner**: Documents Grateful Dead concert experiences and personal thoughts
- **Deployment**: Cloudflare Workers Static Assets (jimi.land)
- **Tech Stack**: Static HTML/CSS/JS, no build process required
- **CMS**: Notion integration for blog posts and gigs

### Key Integration Points
- **Song Tracker**: Tab-separated CSV data at `/data/songs.csv`
- **Blog Posts**: Synced from Notion via `scripts/notion-sync.js`
- **Gigs**: Calendar and list views with Notion integration
- **Responsive**: Mobile-first design with dark theme

### Development Workflow
1. **Test Locally**: `python3 -m http.server 8000`
2. **Make Changes**: Edit files as needed
3. **Update Logs**: Follow .windsurfrules documentation practices
4. **Commit**: `git add . && git commit -m "Clear description"`
5. **Deploy**: `git push origin main` (auto-deploys to https://jimi.land via the Cloudflare deploy workflow)

### Documentation Requirements
- **Every change** must be logged in CHANGELOG.md
- **New features** must be documented in FEATURE_LOG.md
- **Issues/fixes** must be logged in TROUBLESHOOTING_LOG.md
- **Include**: Timestamp, files affected, reason for change, technical details

## 📚 Documentation

### Logs Location
- **Changes**: `Change_Logs/CHANGELOG.md`
- **Features**: `Feature_Logs/FEATURE_LOG.md`
- **Troubleshooting**: `Troubleshooting_Logs/TROUBLESHOOTING_LOG.md`
- **Issues**: `Troubleshooting_Logs/TROUBLESHOOTING_LOG.md`

### Key Design Decisions
- **Static Site**: No build process; assets are served as-is by the Worker
- **Notion CMS**: Content managed in Notion, synced via API
- **Minimal Design**: Warm-neutral palette, light + dark, burnt amber accent
- **Mobile First**: Responsive design for all devices
- **Performance**: Lightweight, fast loading, Cloudflare-edge-cached

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

**Last Updated**: May 10, 2026
**Version**: 2.1 (Cloudflare migration + warm-neutral theme)
**Status**: Production Ready ✅
