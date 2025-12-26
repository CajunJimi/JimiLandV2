# Projects Section - Notion Setup Guide

## Notion Database Setup

### 1. Create New Notion Database

1. Open Notion
2. Create a new database (table view)
3. Name it "Projects" or "JimiLand Projects"

### 2. Add Required Properties

Your database needs these exact property names:

| Property | Type | Options | Required |
|----------|------|---------|----------|
| **Name** | Title | - | ✅ Yes |
| **Description** | Text | - | ✅ Yes (short blurb) |
| **Status** | Select | Live, In Progress, Idea | ✅ Yes |
| **Link** | URL | - | Optional |
| **Date** | Date | - | Optional (completion/start date) |
| **Published** | Checkbox | - | ✅ Yes |

### 3. Status Options Setup

For the **Status** property, create these three options:
- **Live** - Completed projects that are live/public
- **In Progress** - Currently working on
- **Idea** - Future ideas/concepts

### 4. Get Database ID

1. Open your Projects database in Notion
2. Click "Share" → "Copy link"
3. Extract the database ID from the URL:
   ```
   https://notion.so/yourworkspace/{DATABASE_ID}?v=...
                                  ↑ This is your ID
   ```

### 5. Add to .env File

Add this line to your `.env` file:
```
NOTION_PROJECTS_DATABASE_ID=your_database_id_here
```

## Adding Projects/Ideas

### For a Project (Live or In Progress):

1. **Name**: Your project name (e.g., "CajunTools")
2. **Description**: Short blurb (~100-150 characters)
   - Example: "AI-powered Cajun recipe generator. Built with Next.js and OpenAI API."
3. **Status**: Select "Live" or "In Progress"
4. **Link**: URL to live project (optional)
5. **Date**: Completion or start date (optional, shows year)
6. **Published**: ✓ Check this box to show on site

### For an Idea:

1. **Name**: Idea name (e.g., "Concert Photo Archive")
2. **Description**: Brief description of the idea
   - Example: "Automated system to organize and tag concert photos by venue, artist, and date"
3. **Status**: Select "Idea"
4. **Link**: Leave empty
5. **Date**: Leave empty
6. **Published**: ✓ Check this box to show on site

## How It Displays

### Projects Tab
Shows items with Status = "Live" or "In Progress"

```
┌─────────────────────────────────┐
│ CajunTools              LIVE    │
│ ─────────────────────────────   │
│ AI-powered Cajun recipe         │
│ generator. Built with Next.js   │
│                                 │
│ [View Project →]        2025    │
└─────────────────────────────────┘
```

### Ideas Tab
Shows items with Status = "Idea"

```
• Concert Photo Archive
  Automated system to organize and
  tag concert photos by venue and date
```

## Publishing Workflow

### From Phone:
1. Open Notion app
2. Add new row to Projects database
3. Fill in fields
4. Check "Published" box
5. Auto-syncs within 1 hour (or manual trigger via GitHub app)

### From Desktop:
Same as above, just easier to type!

## Examples

### Example Project Entry:
- **Name**: CajunTools
- **Description**: AI-powered Cajun recipe generator with ingredient substitutions and cooking tips
- **Status**: Live
- **Link**: https://cajuntools.com
- **Date**: January 2025
- **Published**: ✓

### Example Idea Entry:
- **Name**: Setlist Pattern Analyzer  
- **Description**: Track song frequency and placement patterns across multiple Dead & Co. tours
- **Status**: Idea
- **Link**: (empty)
- **Date**: (empty)
- **Published**: ✓

## Tips

- Keep descriptions concise (1-2 sentences)
- Use "Published" checkbox to draft projects before showing them
- You can move items from "Idea" → "In Progress" → "Live" as you work
- Date is optional but nice to show project timeline
- Link only needed for live/deployed projects

---

**That's it! Add projects in Notion, they'll appear on your site automatically.** 🚀
