# JimiLand - Simple Usage Guide

Write in Notion. That's it. A GitHub Action pulls from Notion **every hour**,
commits any changes and deploys to Cloudflare. No terminal needed.

## 🔗 Links

| What | Where |
|---|---|
| Live site | https://jimi.land |
| Posts database | https://www.notion.so/139cb99eb16c806086d1d15c10d88f2b |
| Gigs database | https://www.notion.so/16ccb99eb16c80ea893fca0d9630f768 |
| Projects database | https://www.notion.so/2d5cb99eb16c807f9105f8327a8e7dcc |
| Places database (World map) | https://www.notion.so/35ccb99eb16c806e8e02d94d196d19a4 |
| Sync & deploy runs | https://github.com/CajunJimi/JimiLandV2/actions |
| Analytics | https://pulse.jimi.land |
| Hosting | Cloudflare dashboard → Workers → `jimiland` |

## 📝 Publishing a Blog Post

1. Open the **Posts** database and add a new page.
2. Fill in:
   - **Title** - becomes the URL slug (`/posts/<slug>/`)
   - **Date** - publication date (defaults to today if blank)
   - **Excerpt** - one-line summary shown on the home page (optional)
   - **Tags** - optional
3. Write the post **in the page itself**.
   (The old **Content** field still works if you'd rather point at another
   Notion page, but you don't need it.)
4. Tick **Published**. Unticked posts never reach the site.
5. Wait up to an hour - or publish now: Actions → **Sync from Notion** →
   **Run workflow** (works from the GitHub mobile app too).

Editing or unticking a published post works the same way.

## 🎵 Adding a Gig

Add a row to the **Gigs** database: **Title**, **Artist**, **Date**,
**Venue**, **location** (either `location` or `Location` works).
Every row ships - there's no Published box for gigs. The venue + location
get geocoded onto the World map.

## 🛠 Projects & 🌍 Places

- **Projects**: Name, Description, Status, Link, Date - tick **Published**.
- **Places**: Title, Location, Category, Trip, Date, Photos, Linked Posts /
  Linked Gigs - tick **Published**.

## 🎸 Song Tracker

Not in Notion - edit `data/songs.csv` and push to `main`. It's a normal
comma-separated file with a header row:

```
Song,Times Played,Writer,Performer,When / Where / Who
```

## 🌐 Site Structure

- **Home** (`/`) - latest posts
- **Archive** (`/archive/`) - all posts by year
- **Gigs** (`/gigs/`) - gig log + song tracker
- **Projects** (`/projects/`)
- **World** (`/world/`) - map of places and gigs

## 🔧 If Something Looks Wrong

- Check the latest **Sync from Notion** run on the Actions page.
- Run the sync locally: `node scripts/notion-sync.js` (needs `.env`).
- Preview locally: `python3 -m http.server 8000` → http://localhost:8000
- Don't hand-edit generated files in `posts/` or `data/*.json` - the next
  sync overwrites them.
