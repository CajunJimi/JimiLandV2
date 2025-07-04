# JimiLand V2 - Usage Guide

## 🎯 Daily Workflow

### Adding New Content

#### 1. Adding a New Blog Post
1. **In Notion**: Go to your Posts database
2. **Create new entry** with:
   - Title: Your post title
   - Date: Publication date
   - Published: ✅ (check this box)
   - Description: Brief excerpt
   - Tags: Relevant categories
   - Slug: URL-friendly version (e.g., "my-new-post")
   - Content: Link to your actual content page in Notion

3. **Sync to website**:
   ```bash
   cd /Users/joshbrown/Desktop/DevWorld/Coding_Take_two/Personal/JimiLandV2
   node scripts/notion-sync.js
   ```

4. **Test locally**:
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

#### 2. Adding a New Gig
1. **In Notion**: Go to your Gigs database
2. **Create new entry** with:
   - Title: Can leave as "Untitled Gig"
   - Artist: Band/artist name (e.g., "Bob Weir & the Wolf Bros")
   - Date: Gig date
   - Venue: Venue name (e.g., "Royal Albert Hall")
   - Location: City (e.g., "London")
   - Status: Published
   - Type: Gig

3. **Sync to website**:
   ```bash
   node scripts/notion-sync.js
   ```

### 3. Regular Maintenance

#### Weekly Content Update
```bash
# Navigate to project
cd /Users/joshbrown/Desktop/DevWorld/Coding_Take_two/Personal/JimiLandV2

# Sync latest content
node scripts/notion-sync.js

# Test locally
python3 -m http.server 8000

# If everything looks good, deploy
git add .
git commit -m "Weekly content update - $(date +%Y-%m-%d)"
git push origin main
```

## 🔧 Command Reference

### Essential Commands

#### Content Sync
```bash
# Full sync (posts + gigs)
node scripts/notion-sync.js

# Check what was synced
echo "Posts: $(cat data/posts.json | jq length)"
echo "Gigs: $(cat data/gigs.json | jq length)"
```

#### Local Development
```bash
# Start server (choose any available port)
python3 -m http.server 8000   # Primary
python3 -m http.server 8001   # Alternative
python3 -m http.server 3000   # Alternative

# Stop server
# Press Ctrl+C in terminal, or:
pkill -f "python3 -m http.server"
```

#### Data Validation
```bash
# Check JSON files are valid
cat data/posts.json | jq . > /dev/null && echo "✅ Posts JSON valid"
cat data/gigs.json | jq . > /dev/null && echo "✅ Gigs JSON valid"

# Count content
echo "Posts: $(cat data/posts.json | jq length)"
echo "Gigs: $(cat data/gigs.json | jq length)"
echo "Generated post pages: $(ls posts/ | wc -l)"
```

## 🎨 Customization Guide

### Changing Colors
Edit `assets/css/main.css`:
```css
:root {
    --bg-color: #000;        /* Background */
    --text-color: #fff;      /* Text */
    --accent-color: #ff0000; /* Red accents */
    --border-color: #333;    /* Borders */
}
```

### Adding New Pages
1. Create HTML file in root directory
2. Follow existing structure from `about/index.html`
3. Add navigation link to all existing pages
4. Update `assets/js/main.js` if needed

### Modifying Gig Display
Edit `assets/js/gigs-loader.js`:
- `createGigElement()`: Change how gigs appear in list view
- `generateCalendar()`: Modify calendar appearance
- `filterGigs()`: Adjust filtering logic

## 📊 Site Analytics

### Content Overview
```bash
# Quick stats
echo "=== SITE STATS ==="
echo "Posts: $(cat data/posts.json | jq length)"
echo "Gigs: $(cat data/gigs.json | jq length)"
echo "Generated pages: $(ls posts/ | wc -l)"
echo "Last sync: $(stat -f %Sm data/posts.json)"
```

### Upcoming Gigs
```bash
# Check upcoming gigs
cat data/gigs.json | jq '.[] | select(.date > "'$(date +%Y-%m-%d)'") | {artist, venue, date}' | head -10
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### "No gigs showing on calendar"
```bash
# Check gig data
cat data/gigs.json | jq '.[0]'

# Verify dates are properly formatted
cat data/gigs.json | jq '.[] | .date' | head -5

# Re-sync if needed
node scripts/notion-sync.js
```

#### "Posts not updating"
```bash
# Check if posts are marked as published in Notion
cat data/posts.json | jq '.[] | {title, published: .published}'

# Verify sync is working
node scripts/notion-sync.js
```

#### "Notion sync failing"
```bash
# Check environment variables
cat .env

# Test Notion connection
node -e "
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
console.log('Testing connection...');
notion.databases.query({ database_id: process.env.NOTION_POSTS_DATABASE_ID })
  .then(() => console.log('✅ Connection successful'))
  .catch(err => console.log('❌ Connection failed:', err.message));
"
```

### Emergency Reset
```bash
# If something goes wrong, reset to clean state
git stash
git pull origin main
node scripts/notion-sync.js
python3 -m http.server 8000
```

## 📝 Content Guidelines

### Blog Posts
- **Titles**: Clear, descriptive
- **Slugs**: lowercase, hyphens only (e.g., "my-blog-post")
- **Descriptions**: 1-2 sentences, engaging
- **Tags**: Use existing tags when possible
- **Content**: Write in Notion page, link in Content field

### Gigs
- **Artist**: Always fill this field for proper display
- **Venue**: Full venue name
- **Location**: City, State/Country
- **Date**: Use proper date format in Notion
- **Status**: Published for live gigs, Draft for tentative

## 🔄 Backup & Recovery

### Backup Important Files
```bash
# Create backup
tar -czf jimiland-backup-$(date +%Y%m%d).tar.gz \
  data/ posts/ assets/ scripts/ *.md *.html .env

# Restore from backup
tar -xzf jimiland-backup-YYYYMMDD.tar.gz
```

### Git History
```bash
# View recent changes
git log --oneline -10

# Revert to previous version if needed
git reset --hard HEAD~1
```

---

**Quick Reference Card**:
- **Sync**: `node scripts/notion-sync.js`
- **Test**: `python3 -m http.server 8000`
- **Deploy**: `git add . && git commit -m "Update" && git push`
- **Stats**: `echo "Posts: $(cat data/posts.json | jq length)"`
