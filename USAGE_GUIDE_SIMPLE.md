# JimiLand - Simple Usage Guide

## Quick Start

Your site is now **100% dynamic** - all content loads automatically from Notion.

### 📝 Adding a New Blog Post

1. **Open Notion** - Go to your Posts database
2. **Create new post** with these fields:
   - **Title**: Your post title
   - **Date**: Publication date
   - **Published**: ✓ Check this box
   - **Excerpt**: Short description (optional)
   - **Content**: Link to your full Notion page with the post content

3. **Sync to site**:
   ```bash
   node scripts/notion-sync.js
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Added new post"
   git push origin main
   ```

5. **Live in 1-3 minutes** at https://jimi.land

### 🎵 Adding Gigs

1. **Open Notion** - Go to your Gigs database
2. **Add gig details**:
   - **Title**: Event name
   - **Artist**: Band/artist name
   - **Date**: Gig date
   - **Venue**: Venue name
   - **Location**: City/location

3. **Sync**: Run `node scripts/notion-sync.js`
4. **Deploy**: Push to GitHub

### 🎸 Updating Song Tracker

1. **Edit** `/data/songs.csv`
2. **Format**: `Song Name [TAB] Play Count [TAB] Details`
3. **Commit and push** to GitHub

## 🌐 Site Structure

- **Home** (`/`) - Latest 5 posts
- **Archive** (`/archive/`) - All posts by year
- **Gigs** (`/gigs/`) - Gigs list + Song Tracker tabs

## 🔧 Local Development

```bash
# Start local server
python3 -m http.server 8000

# View at http://localhost:8000
```

## 📋 Files You'll Edit

- **Never touch HTML files** - They're now templates
- **Edit in Notion** - Your posts database
- **Edit songs.csv** - For song tracker updates
- **Run sync script** - To pull changes

## ✅ That's It!

No more manual HTML editing. Just:
1. Write in Notion
2. Run sync script
3. Push to GitHub
4. Done!
