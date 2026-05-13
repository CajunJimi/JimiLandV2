#!/usr/bin/env node

/**
 * Notion → Static Site Sync
 *
 * Pulls content from a configurable list of Notion databases, optionally
 * geocodes location strings (cached to disk), writes one JSON file per
 * database into /data, and renders individual post HTML pages for Posts.
 *
 * Adding a new database = appending one entry to the DATABASES array.
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const REPO_ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(REPO_ROOT, 'data');
const POSTS_DIR = path.join(REPO_ROOT, 'posts');
const GEOCODE_CACHE_PATH = path.join(DATA_DIR, '.geocode-cache.json');

const NOMINATIM_USER_AGENT = 'JimiLand Sync (https://jimi.land)';
const NOMINATIM_RATE_LIMIT_MS = 1100; // Nominatim: max 1 req/sec.

if (!NOTION_API_KEY) {
    console.error('❌ Missing required environment variable: NOTION_API_KEY');
    process.exit(1);
}

// One entry per Notion database. Adding a 5th database = one block here.
const DATABASES = [
    {
        name: 'posts',
        envVar: 'NOTION_POSTS_DATABASE_ID',
        sortProperty: 'Date',
        transform: convertNotionPageToPost,
        // Only ship rows where Published checkbox is ticked.
        publishedFilter: (p) => p.published === true,
        outputFile: path.join(DATA_DIR, 'posts.json'),
        // Renders individual /posts/<slug>/index.html pages.
        postProcess: postProcessPosts,
    },
    {
        name: 'gigs',
        envVar: 'NOTION_GIGS_DATABASE_ID',
        sortProperty: 'Date',
        transform: convertNotionPageToGig,
        publishedFilter: null, // every row in the gigs DB ships
        outputFile: path.join(DATA_DIR, 'gigs.json'),
        // Geocode "venue, location" so the world map can pin them.
        postProcess: async (gigs) => {
            await geocodeAll(gigs, (g) => {
                if (g.venue && g.location) return `${g.venue}, ${g.location}`;
                return g.location || g.venue || null;
            });
        },
    },
    {
        name: 'projects',
        envVar: 'NOTION_PROJECTS_DATABASE_ID',
        sortProperty: 'Date',
        transform: convertNotionPageToProject,
        publishedFilter: (p) => p.published === true,
        outputFile: path.join(DATA_DIR, 'projects.json'),
        postProcess: null,
    },
    {
        name: 'places',
        envVar: 'NOTION_PLACES_DATABASE_ID',
        sortProperty: 'Date',
        transform: convertNotionPageToPlace,
        publishedFilter: (p) => p.published === true,
        outputFile: path.join(DATA_DIR, 'places.json'),
        // Geocode the Location string; resolve Linked Posts relations to URLs.
        postProcess: async (places, allData) => {
            await geocodeAll(places, (p) => p.location);
            resolveLinkedPosts(places, allData.posts || []);
        },
    },
];

// ─────────────────────────────────────────────────────────────
// Notion API
// ─────────────────────────────────────────────────────────────

async function fetchNotionPages(databaseId, sortProperty = 'Date') {
    const results = [];
    let cursor = undefined;

    while (true) {
        const body = {
            sorts: sortProperty ? [{ property: sortProperty, direction: 'descending' }] : [],
        };
        if (cursor) body.start_cursor = cursor;

        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Common case: missing sort property on a DB that doesn't have it.
            // Retry once without a sort, so we don't fail the whole sync.
            if (sortProperty && response.status === 400) {
                return fetchNotionPages(databaseId, null);
            }
            const errText = await response.text();
            throw new Error(`Notion API ${response.status}: ${errText}`);
        }

        const data = await response.json();
        results.push(...data.results);
        if (!data.has_more) break;
        cursor = data.next_cursor;
    }

    return results;
}

async function fetchPageContent(pageId) {
    try {
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
            },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`  ⚠️ Failed to fetch page content ${pageId}: ${error.message}`);
        return [];
    }
}

// ─────────────────────────────────────────────────────────────
// Notion blocks → HTML
// ─────────────────────────────────────────────────────────────

function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('www.') ? 'https://' + url : url;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

function richTextToString(richText) {
    if (!Array.isArray(richText)) return '';
    return richText.map((t) => t.plain_text || '').join('');
}

function convertBlocksToHTML(blocks) {
    let html = '';
    for (const block of blocks) {
        switch (block.type) {
            case 'paragraph': {
                const t = richTextToString(block.paragraph.rich_text);
                if (t.trim()) html += `<p>${linkifyText(t)}</p>\n`;
                break;
            }
            case 'heading_1':
                html += `<h1>${linkifyText(richTextToString(block.heading_1.rich_text))}</h1>\n`;
                break;
            case 'heading_2':
                html += `<h2>${linkifyText(richTextToString(block.heading_2.rich_text))}</h2>\n`;
                break;
            case 'heading_3':
                html += `<h3>${linkifyText(richTextToString(block.heading_3.rich_text))}</h3>\n`;
                break;
            case 'bulleted_list_item':
                html += `<li>${linkifyText(richTextToString(block.bulleted_list_item.rich_text))}</li>\n`;
                break;
            case 'numbered_list_item':
                html += `<li>${linkifyText(richTextToString(block.numbered_list_item.rich_text))}</li>\n`;
                break;
            case 'quote':
                html += `<blockquote>${linkifyText(richTextToString(block.quote.rich_text))}</blockquote>\n`;
                break;
            case 'code':
                html += `<pre><code>${richTextToString(block.code.rich_text)}</code></pre>\n`;
                break;
            default: {
                const inner = block[block.type]?.rich_text;
                if (inner) {
                    const t = richTextToString(inner);
                    if (t.trim()) html += `<p>${linkifyText(t)}</p>\n`;
                }
                break;
            }
        }
    }
    return html;
}

// ─────────────────────────────────────────────────────────────
// Per-database transformers
// ─────────────────────────────────────────────────────────────

function generateSlug(title) {
    return (title || 'untitled')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getProp(properties, name) {
    return properties[name];
}

function getTextProp(properties, name) {
    return properties[name]?.rich_text?.[0]?.plain_text || '';
}

function getTitleProp(properties, name) {
    return properties[name]?.title?.[0]?.plain_text || '';
}

function getSelectProp(properties, name) {
    return properties[name]?.select?.name || null;
}

function getCheckboxProp(properties, name) {
    return properties[name]?.checkbox || false;
}

function getDatePropRaw(properties, name) {
    return properties[name]?.date || null;
}

function getRelationProp(properties, name) {
    return properties[name]?.relation?.map((r) => r.id) || [];
}

function getFilesProp(properties, name) {
    const files = properties[name]?.files || [];
    return files
        .map((f) => f.file?.url || f.external?.url)
        .filter(Boolean);
}

function convertNotionPageToPost(page) {
    const p = page.properties;
    const title = getTitleProp(p, 'Title');
    return {
        id: page.id,
        title: title || 'Untitled',
        date: p.Date?.date?.start || new Date().toISOString().split('T')[0],
        published: getCheckboxProp(p, 'Published'),
        status: getSelectProp(p, 'Status') || 'Draft',
        tags: p.Tags?.multi_select?.map((t) => t.name) || [],
        excerpt: getTextProp(p, 'Excerpt') || getTextProp(p, 'Description') || '',
        slug: generateSlug(title),
        notion_url: page.url,
        content_url: getTextProp(p, 'Content') || null,
        last_edited: page.last_edited_time,
    };
}

function convertNotionPageToGig(page) {
    const p = page.properties;
    const title = getTitleProp(p, 'Title') || getTitleProp(p, 'Name');
    return {
        id: page.id,
        title: title || 'Untitled Gig',
        artist: getTextProp(p, 'Artist'),
        date: p.Date?.date?.start || '',
        venue: getTextProp(p, 'Venue'),
        // Notion's existing schema has a lowercase 'location' for gigs.
        location: getTextProp(p, 'location') || getTextProp(p, 'Location'),
        status: getSelectProp(p, 'Status') || 'Draft',
        type: getSelectProp(p, 'Type') || 'Gig',
        slug: generateSlug(title),
        notion_url: page.url,
        last_edited: page.last_edited_time,
    };
}

function convertNotionPageToProject(page) {
    const p = page.properties;
    return {
        id: page.id,
        name: getTitleProp(p, 'Name') || 'Untitled',
        description: getTextProp(p, 'Description'),
        status: getSelectProp(p, 'Status') || 'Idea',
        link: p.Link?.url || null,
        date: p.Date?.date?.start || null,
        published: getCheckboxProp(p, 'Published'),
    };
}

function convertNotionPageToPlace(page) {
    const p = page.properties;
    const date = getDatePropRaw(p, 'Date');
    return {
        id: page.id,
        title: getTitleProp(p, 'Title') || 'Untitled Place',
        location: getTextProp(p, 'Location'),
        // Lat/Lng filled by the geocoding step in postProcess.
        lat: null,
        lng: null,
        category: getSelectProp(p, 'Category') || 'Other',
        trip: getSelectProp(p, 'Trip') || null,
        date_start: date?.start || null,
        date_end: date?.end || null,
        published: getCheckboxProp(p, 'Published'),
        // Raw relation IDs; resolved to URLs in postProcess (for Posts).
        // Gigs stay as IDs since gigs don't have stable URLs.
        linked_post_ids: getRelationProp(p, 'Linked Posts'),
        linked_post_urls: [], // filled in postProcess
        linked_gig_ids: getRelationProp(p, 'Linked Gigs'),
        // Notion-hosted photo URLs. Expire ~1 hour; refreshed each sync.
        // R2 upload is a deferred Phase 1 follow-up.
        photos: getFilesProp(p, 'Photos'),
        notion_url: page.url,
        last_edited: page.last_edited_time,
    };
}

// ─────────────────────────────────────────────────────────────
// Geocoding (Nominatim + file cache)
// ─────────────────────────────────────────────────────────────

let geocodeCache = {};
let geocodeCacheDirty = false;
let lastNominatimCallAt = 0;

async function loadGeocodeCache() {
    try {
        const raw = await fs.readFile(GEOCODE_CACHE_PATH, 'utf-8');
        geocodeCache = JSON.parse(raw);
        console.log(`📍 Loaded ${Object.keys(geocodeCache).length} cached geocodes`);
    } catch (e) {
        if (e.code !== 'ENOENT') console.warn(`⚠️ Couldn't load geocode cache: ${e.message}`);
        geocodeCache = {};
    }
}

async function saveGeocodeCache() {
    if (!geocodeCacheDirty) return;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(GEOCODE_CACHE_PATH, JSON.stringify(geocodeCache, null, 2));
    console.log(`💾 Saved geocode cache (${Object.keys(geocodeCache).length} entries)`);
}

function normalizeLocation(s) {
    return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Build progressively-simpler query variants from a location string.
 * Nominatim chokes on overly-specific queries like full US addresses
 * ("Caesars Forum, 3911 Koval Ln, Las Vegas, NV 89109, USA") but
 * happily matches shorter forms ("Caesars Forum, Las Vegas").
 */
function geocodeCandidates(locationStr) {
    const parts = locationStr.split(',').map((s) => s.trim()).filter(Boolean);
    const candidates = [locationStr];
    if (parts.length >= 4) {
        // Drop the second segment (usually a street address line).
        candidates.push([parts[0], ...parts.slice(2)].join(', '));
    }
    if (parts.length >= 3) {
        candidates.push([parts[0], ...parts.slice(-2)].join(', '));
    }
    if (parts.length >= 2) {
        candidates.push(`${parts[0]}, ${parts[parts.length - 1]}`);
    }
    // De-duplicate while preserving order.
    return [...new Set(candidates)];
}

async function nominatimQuery(q) {
    const elapsed = Date.now() - lastNominatimCallAt;
    if (elapsed < NOMINATIM_RATE_LIMIT_MS) {
        await new Promise((r) => setTimeout(r, NOMINATIM_RATE_LIMIT_MS - elapsed));
    }
    lastNominatimCallAt = Date.now();

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
        headers: { 'User-Agent': NOMINATIM_USER_AGENT },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
}

async function geocode(locationStr) {
    if (!locationStr) return null;
    const key = normalizeLocation(locationStr);
    if (!key) return null;

    // Cache hit (including negative results — null in cache means "tried, no match").
    if (Object.prototype.hasOwnProperty.call(geocodeCache, key)) {
        return geocodeCache[key];
    }

    try {
        const candidates = geocodeCandidates(locationStr);
        for (const candidate of candidates) {
            const coords = await nominatimQuery(candidate);
            if (coords) {
                geocodeCache[key] = coords;
                geocodeCacheDirty = true;
                const via = candidate === locationStr ? '' : ` (via "${candidate}")`;
                console.log(`  📍 Geocoded "${locationStr}" → ${coords.lat}, ${coords.lng}${via}`);
                return coords;
            }
        }
        geocodeCache[key] = null;
        geocodeCacheDirty = true;
        console.warn(`  ⚠️ No geocode match for "${locationStr}"`);
        return null;
    } catch (e) {
        console.warn(`  ⚠️ Geocode error for "${locationStr}": ${e.message}`);
        return null;
    }
}

/**
 * Geocode every item in `items` using `locationFn(item)` to extract the
 * location string. Writes `lat`/`lng` back onto each item.
 */
async function geocodeAll(items, locationFn) {
    for (const item of items) {
        const loc = locationFn(item);
        if (!loc) continue;
        const coords = await geocode(loc);
        if (coords) {
            item.lat = coords.lat;
            item.lng = coords.lng;
        }
    }
}

// ─────────────────────────────────────────────────────────────
// Cross-database relation resolution
// ─────────────────────────────────────────────────────────────

function resolveLinkedPosts(places, posts) {
    const postById = new Map(posts.map((p) => [p.id, p]));
    for (const place of places) {
        const urls = [];
        for (const pid of place.linked_post_ids || []) {
            const post = postById.get(pid);
            if (post?.url) urls.push(post.url);
        }
        place.linked_post_urls = urls;
    }
}

// ─────────────────────────────────────────────────────────────
// Post HTML rendering
// ─────────────────────────────────────────────────────────────

async function postProcessPosts(posts) {
    await fs.mkdir(POSTS_DIR, { recursive: true });

    for (const post of posts) {
        try {
            console.log(`  Creating page for: ${post.title}`);

            // Extract page ID either from the Content URL (if user set one) or fall
            // back to the database entry's own page ID.
            let pageIdToFetch = post.id;
            if (post.content_url && post.content_url.includes('notion.so')) {
                const match = post.content_url.match(/([a-f0-9]{32})/);
                if (match) pageIdToFetch = match[1];
            }

            const blocks = await fetchPageContent(pageIdToFetch);
            let content = convertBlocksToHTML(blocks);

            if (content.trim().length === 0) {
                content = post.excerpt
                    ? `<p>${post.excerpt}</p>`
                    : generateSampleContent(post.title, post.date);
            }

            const html = createPostHTML(post, content);
            const postDir = path.join(POSTS_DIR, post.slug);
            await fs.mkdir(postDir, { recursive: true });
            await fs.writeFile(path.join(postDir, 'index.html'), html);

            // Site-relative URL replaces the raw Notion URL for output.
            post.url = `/posts/${post.slug}/`;
            delete post.notion_url;
        } catch (e) {
            console.error(`  ⚠️ Failed to render ${post.title}: ${e.message}`);
            post.url = '#';
        }
    }
}

function generateSampleContent(title, date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    return `<p>Welcome to my post about <strong>${title}</strong>, published on ${formattedDate}.</p>
<p>This is where the main content of your blog post will appear.</p>`;
}

function createPostHTML(post, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - JimiLand</title>
    <meta name="description" content="${post.excerpt}">
    <script>
      (function () {
        try {
          var saved = localStorage.getItem('jimiland-theme');
          var prefers = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.dataset.theme = saved || prefers;
        } catch (e) { document.documentElement.dataset.theme = 'dark'; }
      })();
    </script>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <!-- Reading Progress Bar -->
    <div class="reading-progress" id="reading-progress"></div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="/">JimiLand</a>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/archive/" class="nav-link">Archive</a>
                <a href="/gigs/" class="nav-link">Gigs</a>
                <a href="/projects/" class="nav-link">Projects</a>
                <a href="/world/" class="nav-link">World</a>
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle light/dark theme" type="button">
                    <svg class="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                </button>
            </div>
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <main>
        <article>
            <header class="post-header">
                <h1>${post.title}</h1>
                <time class="post-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </header>
            <div class="post-content">
                ${content}
            </div>
            <nav class="post-nav">
                <a href="/">← Back to Home</a>
            </nav>
        </article>
    </main>

    <script src="/assets/js/app.js"></script>
    <script>
        window.addEventListener('scroll', function() {
            const progressBar = document.getElementById('reading-progress');
            const article = document.querySelector('.post-content');
            if (!progressBar || !article) return;
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollStart = articleTop - windowHeight / 2;
            const scrollEnd = articleTop + articleHeight - windowHeight / 2;
            const scrollProgress = (scrollTop - scrollStart) / (scrollEnd - scrollStart);
            const progress = Math.max(0, Math.min(1, scrollProgress));
            progressBar.style.width = (progress * 100) + '%';
        });
    </script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────

async function saveJSON(items, outputFile) {
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(items, null, 2));
    console.log(`✅ Saved ${items.length} item(s) to ${path.relative(REPO_ROOT, outputFile)}`);
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function syncNotionContent() {
    console.log('🔄 Syncing content from Notion...');
    await loadGeocodeCache();

    // Accumulate per-database results so later post-processors can cross-reference.
    const allData = {};

    for (const db of DATABASES) {
        const databaseId = process.env[db.envVar];
        if (!databaseId) {
            console.log(`⏭️  Skipping ${db.name} (${db.envVar} not set)`);
            allData[db.name] = [];
            continue;
        }

        try {
            console.log(`\n📥 Fetching ${db.name}...`);
            const pages = await fetchNotionPages(databaseId, db.sortProperty);
            let items = pages.map(db.transform);

            const beforeFilter = items.length;
            if (db.publishedFilter) {
                items = items.filter(db.publishedFilter);
                console.log(`   ${items.length}/${beforeFilter} published`);
            } else {
                console.log(`   ${items.length} total`);
            }

            if (db.postProcess) {
                await db.postProcess(items, allData);
            }

            await saveJSON(items, db.outputFile);
            allData[db.name] = items;
        } catch (e) {
            console.error(`⚠️ Failed ${db.name}: ${e.message}`);
            allData[db.name] = [];
        }
    }

    await saveGeocodeCache();
    console.log('\n✅ Sync completed successfully!');
}

// Run the sync
if (require.main === module) {
    syncNotionContent().catch((err) => {
        console.error('❌ Sync failed:', err);
        process.exit(1);
    });
}

module.exports = { syncNotionContent };
