#!/usr/bin/env node

/**
 * Notion to Static Site Sync Script
 * Fetches content from Notion database and generates static JSON files
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// Notion API configuration
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_POSTS_DATABASE_ID = process.env.NOTION_POSTS_DATABASE_ID;
const NOTION_GIGS_DATABASE_ID = process.env.NOTION_GIGS_DATABASE_ID;
const NOTION_PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID;

if (!NOTION_API_KEY) {
    console.error('❌ Missing required environment variable: NOTION_API_KEY');
    process.exit(1);
}

if (!NOTION_POSTS_DATABASE_ID && !NOTION_GIGS_DATABASE_ID && !NOTION_PROJECTS_DATABASE_ID) {
    console.error('❌ At least one database ID must be provided:');
    console.error('   NOTION_POSTS_DATABASE_ID, NOTION_GIGS_DATABASE_ID, or NOTION_PROJECTS_DATABASE_ID');
    process.exit(1);
}

/**
 * Fetch pages from Notion database
 */
async function fetchNotionPages(databaseId, sortProperty = 'Date') {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                sorts: [
                    {
                        property: sortProperty,
                        direction: 'descending'
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`❌ Error fetching from Notion database ${databaseId}:`, error.message);
        throw error;
    }
}

/**
 * Fetch full content of a Notion page
 */
async function fetchPageContent(pageId) {
    try {
        console.log(`    Fetching content for page: ${pageId}`);
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });

        if (!response.ok) {
            console.error(`    HTTP error fetching page content: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(`    Raw API response:`, JSON.stringify(data, null, 2));
        return data.results;
    } catch (error) {
        console.error(`❌ Error fetching page content ${pageId}:`, error.message);
        return [];
    }
}

/**
 * Convert Notion blocks to HTML content
 */
function convertBlocksToHTML(blocks) {
    let html = '';
    
    for (const block of blocks) {
        switch (block.type) {
            case 'paragraph':
                const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
                if (text.trim()) {
                    html += `<p>${text}</p>\n`;
                }
                break;
            case 'heading_1':
                const h1Text = block.heading_1.rich_text.map(t => t.plain_text).join('');
                html += `<h1>${h1Text}</h1>\n`;
                break;
            case 'heading_2':
                const h2Text = block.heading_2.rich_text.map(t => t.plain_text).join('');
                html += `<h2>${h2Text}</h2>\n`;
                break;
            case 'heading_3':
                const h3Text = block.heading_3.rich_text.map(t => t.plain_text).join('');
                html += `<h3>${h3Text}</h3>\n`;
                break;
            case 'bulleted_list_item':
                const bulletText = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
                html += `<li>${bulletText}</li>\n`;
                break;
            case 'numbered_list_item':
                const numberedText = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
                html += `<li>${numberedText}</li>\n`;
                break;
            case 'quote':
                const quoteText = block.quote.rich_text.map(t => t.plain_text).join('');
                html += `<blockquote>${quoteText}</blockquote>\n`;
                break;
            case 'code':
                const codeText = block.code.rich_text.map(t => t.plain_text).join('');
                html += `<pre><code>${codeText}</code></pre>\n`;
                break;
            default:
                // Handle other block types as plain text
                if (block[block.type]?.rich_text) {
                    const plainText = block[block.type].rich_text.map(t => t.plain_text).join('');
                    if (plainText.trim()) {
                        html += `<p>${plainText}</p>\n`;
                    }
                }
                break;
        }
    }
    
    return html;
}

/**
 * Convert Notion page to simplified post object
 */
function convertNotionPageToPost(page) {
    const properties = page.properties;
    
    return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
        published: properties.Published?.checkbox || false,
        status: properties.Status?.select?.name || 'Draft',
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || properties.Description?.rich_text?.[0]?.plain_text || '',
        slug: generateSlug(properties.Title?.title?.[0]?.plain_text || 'untitled'),
        notion_url: page.url,
        content_url: properties.Content?.rich_text?.[0]?.plain_text || null,
        last_edited: page.last_edited_time
    };
}

/**
 * Create HTML page for a blog post
 */
function createPostHTML(post, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - JimiLand</title>
    <meta name="description" content="${post.excerpt}">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="/">JimiLand</a>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/archive/" class="nav-link">Archive</a>
                <a href="/gigs/" class="nav-link">Gigs</a>
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
</body>
</html>`;
}

/**
 * Convert Notion page to simplified project object
 */
function convertNotionPageToProject(page) {
    const properties = page.properties;
    
    return {
        id: page.id,
        name: properties.Name?.title?.[0]?.plain_text || 'Untitled',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        status: properties.Status?.select?.name || 'Idea',
        link: properties.Link?.url || null,
        date: properties.Date?.date?.start || null,
        published: properties.Published?.checkbox || false
    };
}

/**
 * Convert Notion page to simplified gig object
 */
function convertNotionPageToGig(page) {
    const properties = page.properties;
    
    return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || properties.Name?.title?.[0]?.plain_text || 'Untitled Gig',
        artist: properties.Artist?.rich_text?.[0]?.plain_text || '',
        date: properties.Date?.date?.start || '', // Don't default to today's date
        venue: properties.Venue?.rich_text?.[0]?.plain_text || '',
        location: properties.Location?.rich_text?.[0]?.plain_text || '',
        status: properties.Status?.select?.name || 'Draft',
        type: properties.Type?.select?.name || 'Gig',
        slug: generateSlug(properties.Title?.title?.[0]?.plain_text || properties.Name?.title?.[0]?.plain_text || 'untitled-gig'),
        notion_url: page.url,
        last_edited: page.last_edited_time
    };
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Generate sample content for posts without content
 */
function generateSampleContent(title, date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return `<p>Welcome to my post about <strong>${title}</strong>, published on ${formattedDate}.</p>
<p>This is where the main content of your blog post will appear. You can write about your experiences, thoughts, and insights here.</p>
<h2>What's Next?</h2>
<p>To add your own content, simply edit this post in your Notion database and run the sync script again.</p>`;
}

/**
 * Save posts to JSON file
 */
async function savePosts(posts) {
    const outputDir = path.join(__dirname, '../data');
    const outputFile = path.join(outputDir, 'posts.json');
    
    // Ensure data directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save posts data
    await fs.writeFile(outputFile, JSON.stringify(posts, null, 2));
    
    console.log(`✅ Saved ${posts.length} posts to ${outputFile}`);
}

/**
 * Save gigs to JSON file
 */
async function saveGigs(gigs) {
    const gigsJsonPath = path.join(__dirname, '..', 'data', 'gigs.json');
    await fs.writeFile(gigsJsonPath, JSON.stringify(gigs, null, 2));
    console.log(`✅ Saved ${gigs.length} gigs to ${gigsJsonPath}`);
}

/**
 * Save projects to JSON file
 */
async function saveProjects(projects) {
    const projectsJsonPath = path.join(__dirname, '..', 'data', 'projects.json');
    await fs.writeFile(projectsJsonPath, JSON.stringify(projects, null, 2));
    console.log(`✅ Saved ${projects.length} projects to ${projectsJsonPath}`);
}

/**
 * Main sync function
 */
async function syncNotionContent() {
    try {
        console.log('🔄 Syncing content from Notion...');
        
        let allPosts = [];
        let allGigs = [];
        let allProjects = [];
        
        // Sync Posts if database ID is provided
        if (NOTION_POSTS_DATABASE_ID) {
            try {
                console.log('📝 Fetching posts...');
                const postPages = await fetchNotionPages(NOTION_POSTS_DATABASE_ID);
                const posts = postPages
                    .map(convertNotionPageToPost)
                    .filter(post => post.published === true); // Filter by checkbox
                
                // Fetch content for each post and create HTML pages
                console.log('📄 Creating HTML pages for posts...');
                const postsDir = path.join(process.cwd(), 'posts');
                await fs.mkdir(postsDir, { recursive: true });
                
                for (const post of posts) {
                    try {
                        console.log(`  Creating page for: ${post.title}`);
                        console.log(`    Database entry ID: ${post.id}`);
                        console.log(`    Content URL: ${post.content_url}`);
                        
                        // Extract page ID from content URL
                        let pageIdToFetch = null;
                        if (post.content_url && post.content_url.includes('notion.so')) {
                            // Extract page ID from content URL like https://www.notion.so/test-1-208cb99eb16c80e18baae4bc8b9ef88c
                            const urlMatch = post.content_url.match(/([a-f0-9]{32})/);
                            if (urlMatch) {
                                pageIdToFetch = urlMatch[1];
                                console.log(`    Extracted content page ID: ${pageIdToFetch}`);
                            } else {
                                console.log(`    Could not extract page ID from content URL`);
                            }
                        } else {
                            console.log(`    No content URL found, trying database entry ID`);
                            pageIdToFetch = post.id;
                        }
                        
                        const blocks = await fetchPageContent(pageIdToFetch);
                        console.log(`    Found ${blocks.length} blocks`);
                        let content = convertBlocksToHTML(blocks);
                        
                        // If no content found, use sample content based on title
                        if (content.trim().length === 0) {
                            if (post.excerpt) {
                                content = `<p>${post.excerpt}</p>`;
                            } else {
                                // Generate sample content based on post title
                                content = generateSampleContent(post.title, post.date);
                            }
                            content += `<p><em>This is sample content. To add real content, open this post in Notion and write your blog post content.</em></p>`;
                        }
                        
                        console.log(`    Generated content length: ${content.length}`);
                        const html = createPostHTML(post, content);
                        
                        const postDir = path.join(postsDir, post.slug);
                        await fs.mkdir(postDir, { recursive: true });
                        await fs.writeFile(path.join(postDir, 'index.html'), html);
                        
                        // Update post object with local URL
                        post.url = `/posts/${post.slug}/`;
                        delete post.notion_url; // Remove Notion URL
                    } catch (error) {
                        console.error(`  ⚠️ Failed to create page for ${post.title}: ${error.message}`);
                        post.url = '#'; // Fallback
                    }
                }
                
                allPosts = posts;
                console.log(`✅ Found ${posts.length} published posts out of ${postPages.length} total`);
            } catch (error) {
                console.error(`⚠️ Failed to fetch posts: ${error.message}`);
            }
        }
        
        // Sync Gigs if database ID is provided
        if (NOTION_GIGS_DATABASE_ID) {
            try {
                console.log('🎵 Fetching gigs...');
                const gigPages = await fetchNotionPages(NOTION_GIGS_DATABASE_ID);
                const gigs = gigPages
                    .map(convertNotionPageToGig);
                    // Show all gigs - if it's in the table, it's on the site
                allGigs = gigs;
                console.log(`✅ Found ${gigs.length} gigs`);
            } catch (error) {
                console.error(`⚠️ Failed to fetch gigs: ${error.message}`);
            }
        }
        
        // Sync Projects if database ID is provided
        if (NOTION_PROJECTS_DATABASE_ID) {
            try {
                console.log('💡 Fetching projects...');
                const projectPages = await fetchNotionPages(NOTION_PROJECTS_DATABASE_ID, 'Date');
                const projects = projectPages
                    .map(convertNotionPageToProject)
                    .filter(project => project.published);
                allProjects = projects;
                console.log(`✅ Found ${projects.length} published projects out of ${projectPages.length} total`);
            } catch (error) {
                console.error(`⚠️ Failed to fetch projects: ${error.message}`);
            }
        }
        
        // Save to JSON files
        await savePosts(allPosts);
        await saveGigs(allGigs);
        await saveProjects(allProjects);
        
        console.log('✅ Sync completed successfully!');
        
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
    }
}

// Run the sync
if (require.main === module) {
    syncNotionContent();
}

module.exports = { syncNotionContent };
