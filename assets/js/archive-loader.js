/**
 * Archive Loader - Integrates Notion content with Archive page
 */

class ArchiveLoader {
    constructor() {
        this.posts = [];
        this.gigs = [];
        this.allItems = [];
        this.currentFilter = 'all';
    }

    /**
     * Initialize the archive loader
     */
    async init() {
        try {
            await this.loadContent();
            this.mergeContent();
            this.updateArchiveData();
            console.log(`Archive loaded with ${this.allItems.length} total items`);
        } catch (error) {
            console.error('Failed to initialize archive loader:', error);
        }
    }

    /**
     * Load content from JSON files
     */
    async loadContent() {
        try {
            // Load posts
            const postsResponse = await fetch('/data/posts.json');
            if (postsResponse.ok) {
                this.posts = await postsResponse.json();
                console.log(`Loaded ${this.posts.length} posts from Notion`);
            }

            // Load gigs
            const gigsResponse = await fetch('/data/gigs.json');
            if (gigsResponse.ok) {
                this.gigs = await gigsResponse.json();
                console.log(`Loaded ${this.gigs.length} gigs from Notion`);
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    /**
     * Merge posts and gigs into archive format
     */
    mergeContent() {
        const archiveItems = [];

        // Convert posts to archive format
        this.posts.forEach(post => {
            archiveItems.push({
                id: `post-${post.id}`,
                date: post.date,
                title: post.title,
                type: 'post',
                category: 'Posts',
                description: post.excerpt || 'Blog post',
                url: post.notion_url || '#',
                tags: post.tags || []
            });
        });

        // Convert gigs to archive format
        this.gigs.forEach(gig => {
            archiveItems.push({
                id: `gig-${gig.id}`,
                date: gig.date,
                title: gig.title,
                type: 'gig',
                category: 'Gigs',
                description: `${gig.venue || 'Venue TBA'} - ${gig.location || ''}`.trim(),
                url: gig.notion_url || '#',
                venue: gig.venue,
                location: gig.location
            });
        });

        // Sort by date (newest first)
        this.allItems = archiveItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Update the existing archive data with Notion content
     */
    updateArchiveData() {
        // Check if the archive.js exists and has archiveData
        if (typeof window.archiveData !== 'undefined') {
            // Merge with existing static data, prioritizing Notion content
            const existingItems = window.archiveData.filter(item => 
                !this.allItems.some(notionItem => 
                    notionItem.title === item.title && notionItem.type === item.type
                )
            );
            
            // Combine and sort
            window.archiveData = [...this.allItems, ...existingItems]
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            console.log(`Updated archive with ${this.allItems.length} Notion items + ${existingItems.length} static items`);
            
            // Trigger archive refresh if the archive is already loaded
            if (typeof window.refreshArchive === 'function') {
                window.refreshArchive();
            }
        } else {
            // Create archiveData if it doesn't exist
            window.archiveData = this.allItems;
            console.log(`Created archive with ${this.allItems.length} Notion items`);
        }
    }

    /**
     * Get items by type for filtering
     */
    getItemsByType(type) {
        return this.allItems.filter(item => item.type === type);
    }

    /**
     * Get recent items
     */
    getRecentItems(limit = 5) {
        return this.allItems.slice(0, limit);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const archiveLoader = new ArchiveLoader();
    await archiveLoader.init();
});

// Export for use in other scripts
window.ArchiveLoader = ArchiveLoader;
