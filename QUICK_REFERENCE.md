# JimiLand V2 - Quick Reference

## 🚀 Essential Commands

### Daily Content Updates
```bash
# Navigate to project
cd /Users/joshbrown/Desktop/DevWorld/Coding_Take_two/Personal/JimiLandV2

# Sync from Notion
node scripts/notion-sync.js

# Test locally
python3 -m http.server 8000

# Deploy
git add . && git commit -m "Content update" && git push
```

### Quick Stats
```bash
# Check content counts
echo "Posts: $(cat data/posts.json | jq length)"
echo "Gigs: $(cat data/gigs.json | jq length)"
```

## 📝 Adding Content

### New Blog Post (in Notion)
1. Posts database → New entry
2. Fill: Title, Date, Published ✅, Description, Slug, Content URL
3. Run: `node scripts/notion-sync.js`

### New Gig (in Notion)  
1. Gigs database → New entry
2. Fill: Artist, Date, Venue, Location, Status: Published
3. Run: `node scripts/notion-sync.js`

## 🔧 Troubleshooting

### Gigs not showing?
```bash
node scripts/notion-sync.js
cat data/gigs.json | jq '.[0]'
```

### Posts missing?
```bash
cat data/posts.json | jq '.[] | {title, published}'
```

### Sync failing?
```bash
cat .env  # Check credentials
```

## 📁 Key Files
- **Content**: `data/posts.json`, `data/gigs.json`
- **Sync**: `scripts/notion-sync.js`
- **Config**: `.env`
- **Docs**: `README.md`, `USAGE_GUIDE.md`

## 🌐 URLs
- **Local**: http://localhost:8000
- **Gigs**: http://localhost:8000/gigs/
- **Archive**: http://localhost:8000/archive/

---
**Site Status**: Production Ready ✅
