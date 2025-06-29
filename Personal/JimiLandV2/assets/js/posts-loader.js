/**
 * Posts Loader - Dynamically loads posts from JSON data
 */

class PostsLoader {
    constructor() {
        this.posts = [];
        this.postsContainer = null;
    }

    /**
     * Initialize the posts loader
     */
    async init() {
        try {
            await this.loadPosts();
            this.setupDOM();
            this.renderPosts();
        } catch (error) {
            console.error('Failed to initialize posts loader:', error);
            this.showError();
        }
    }

    /**
     * Load posts from JSON file
     */
    async loadPosts() {
        try {
            const response = await fetch('/data/posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.posts = await response.json();
            console.log(`Loaded ${this.posts.length} posts`);
        } catch (error) {
            console.error('Error loading posts:', error);
            this.posts = [];
        }
    }

    /**
     * Setup DOM elements
     */
    setupDOM() {
        this.postsContainer = document.querySelector('.posts-grid');
        if (!this.postsContainer) {
            console.error('Posts container not found');
            return;
        }
    }

    /**
     * Render posts to the DOM
     */
    renderPosts(limit = 5) {
        if (!this.postsContainer) return;

        // Clear existing content
        this.postsContainer.innerHTML = '';

        // Get recent posts (show all for now, regardless of status)
        const recentPosts = this.posts.slice(0, limit);

        if (recentPosts.length === 0) {
            this.showNoPosts();
            return;
        }

        // Render each post
        recentPosts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.postsContainer.appendChild(postElement);
        });
    }

    /**
     * Create a post element
     */
    createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'post-card';
        
        const title = document.createElement('h3');
        title.className = 'post-title';
        title.textContent = post.title;
        
        const date = document.createElement('time');
        date.className = 'post-date';
        date.textContent = this.formatDate(post.date);
        
        article.appendChild(title);
        article.appendChild(date);
        
        // Add click handler to navigate to local post page
        if (post.url) {
            article.style.cursor = 'pointer';
            article.addEventListener('click', () => {
                window.location.href = post.url;
            });
        }
        
        return article;
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Show error message
     */
    showError() {
        if (!this.postsContainer) return;
        
        this.postsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load posts. Please try again later.</p>
            </div>
        `;
    }

    /**
     * Show no posts message
     */
    showNoPosts() {
        this.postsContainer.innerHTML = `
            <div class="no-posts">
                <p>No posts available yet.</p>
            </div>
        `;
    }

    /**
     * Fallback sample posts data
     */

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const postsLoader = new PostsLoader();
    postsLoader.init();
});

// Export for use in other scripts
window.PostsLoader = PostsLoader;
