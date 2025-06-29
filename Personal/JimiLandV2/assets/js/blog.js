// ===== BLOG PAGE JAVASCRIPT =====

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 6;
let currentFilter = 'all';
let searchQuery = '';

// Initialize blog page
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
});

async function initializeBlog() {
    await loadAllPosts();
    initializeSearch();
    initializeFilters();
    initializeLoadMore();
    displayPosts();
}

// ===== LOAD POSTS =====
async function loadAllPosts() {
    try {
        const response = await fetch('/assets/data/posts.json');
        if (response.ok) {
            allPosts = await response.json();
            // Sort posts by date (newest first)
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            // Fallback to sample posts
            allPosts = getSamplePosts();
        }
        filteredPosts = [...allPosts];
    } catch (error) {
        console.log('Posts data not found, using sample posts');
        allPosts = getSamplePosts();
        filteredPosts = [...allPosts];
    }
}

function getSamplePosts() {
    return [
        {
            id: 1,
            title: "Welcome to JimiLand",
            excerpt: "Starting fresh with a new blog about music, gigs, and life adventures. Here's what you can expect from this space - honest thoughts, musical discoveries, and stories from the road.",
            content: "# Welcome to JimiLand\n\nAfter years of thinking about it, I've finally decided to start this blog...",
            date: "2025-06-28",
            tags: ["welcome", "music", "blog", "personal"],
            slug: "welcome-to-jimiland",
            readTime: "3 min read",
            image: "/assets/images/posts/welcome.jpg",
            featured: true
        },
        {
            id: 2,
            title: "The Magic of Live Music",
            excerpt: "There's something special about live performances that recorded music just can't capture. The energy, the connection, the spontaneous moments that make each show unique.",
            content: "# The Magic of Live Music\n\nLast night's performance reminded me why I fell in love with music...",
            date: "2025-06-25",
            tags: ["music", "live", "performance", "thoughts"],
            slug: "magic-of-live-music",
            readTime: "6 min read",
            image: "/assets/images/posts/live-music.jpg",
            featured: false
        },
        {
            id: 3,
            title: "Upcoming Gig Schedule",
            excerpt: "Excited to announce some upcoming performances! Here's where you can catch me live over the next few months. Each venue brings its own vibe and energy.",
            content: "# Upcoming Gig Schedule\n\nI'm thrilled to share my upcoming performance schedule...",
            date: "2025-06-20",
            tags: ["gigs", "schedule", "events", "announcements"],
            slug: "upcoming-gig-schedule",
            readTime: "4 min read",
            image: "/assets/images/posts/gig-schedule.jpg",
            featured: false
        },
        {
            id: 4,
            title: "Finding Inspiration in Everyday Moments",
            excerpt: "Sometimes the best songs come from the most ordinary experiences. A conversation overheard at a coffee shop, the way light hits a window, or a random memory that surfaces.",
            content: "# Finding Inspiration in Everyday Moments\n\nCreativity strikes at the most unexpected times...",
            date: "2025-06-15",
            tags: ["creativity", "inspiration", "songwriting", "life"],
            slug: "finding-inspiration-everyday-moments",
            readTime: "5 min read",
            image: "/assets/images/posts/inspiration.jpg",
            featured: true
        },
        {
            id: 5,
            title: "The Evolution of My Sound",
            excerpt: "Looking back at my musical journey, it's fascinating to see how my sound has evolved. From early influences to current experiments, every phase has taught me something new.",
            content: "# The Evolution of My Sound\n\nMusic is a journey, not a destination...",
            date: "2025-06-10",
            tags: ["music", "evolution", "personal", "journey"],
            slug: "evolution-of-my-sound",
            readTime: "7 min read",
            image: "/assets/images/posts/sound-evolution.jpg",
            featured: false
        },
        {
            id: 6,
            title: "Behind the Scenes: Recording Process",
            excerpt: "Ever wondered what goes into recording a song? From the initial idea to the final mix, here's a peek behind the curtain of my creative process.",
            content: "# Behind the Scenes: Recording Process\n\nThe studio is where magic happens...",
            date: "2025-06-05",
            tags: ["recording", "studio", "process", "music"],
            slug: "behind-scenes-recording-process",
            readTime: "8 min read",
            image: "/assets/images/posts/recording.jpg",
            featured: false
        }
    ];
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchQuery = this.value.trim().toLowerCase();
        
        if (searchQuery.length < 2) {
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            // Reset to current filter
            applyFilters();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(event) {
        if (searchResults && !searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.add('hidden');
        }
    });
}

function performSearch() {
    const searchResults = document.getElementById('search-results');
    
    if (searchQuery.length < 2) {
        if (searchResults) searchResults.classList.add('hidden');
        return;
    }

    const results = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery) ||
        post.excerpt.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );

    if (searchResults) {
        displaySearchResults(results);
        searchResults.classList.remove('hidden');
    }

    // Also update main posts display
    applyFilters();
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No posts found</p>';
    } else {
        searchResults.innerHTML = results.slice(0, 5).map(post => `
            <div class="search-result">
                <h4><a href="/blog/${post.slug}/">${post.title}</a></h4>
                <p>${post.excerpt.substring(0, 120)}...</p>
                <div class="search-meta">
                    <span>${formatDate(post.date)}</span>
                    <div class="search-tags">
                        ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    generateFilterTags();
    
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            this.classList.add('active');
            
            currentFilter = this.dataset.tag;
            currentPage = 1;
            applyFilters();
        });
    });
}

function generateFilterTags() {
    const filterContainer = document.getElementById('filter-tags');
    if (!filterContainer) return;

    // Get all unique tags
    const allTags = [...new Set(allPosts.flatMap(post => post.tags))];
    
    // Create filter buttons
    const filterHTML = `
        <button class="filter-tag active" data-tag="all">All Posts</button>
        ${allTags.map(tag => `
            <button class="filter-tag" data-tag="${tag}">${capitalizeFirst(tag)}</button>
        `).join('')}
    `;
    
    filterContainer.innerHTML = filterHTML;
}

function applyFilters() {
    let filtered = [...allPosts];
    
    // Apply tag filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(post => post.tags.includes(currentFilter));
    }
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(searchQuery) ||
            post.excerpt.toLowerCase().includes(searchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    filteredPosts = filtered;
    currentPage = 1;
    displayPosts();
}

// ===== DISPLAY POSTS =====
function displayPosts() {
    const postsGrid = document.getElementById('posts-grid');
    const noPostsMessage = document.getElementById('no-posts');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    if (!postsGrid) return;

    if (filteredPosts.length === 0) {
        postsGrid.innerHTML = '';
        if (noPostsMessage) noPostsMessage.classList.remove('hidden');
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
        return;
    }

    if (noPostsMessage) noPostsMessage.classList.add('hidden');

    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    postsGrid.innerHTML = postsToShow.map(post => createPostCard(post)).join('');

    // Show/hide load more button
    if (loadMoreContainer) {
        if (endIndex >= filteredPosts.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    // Trigger animations
    animatePostCards();
}

function createPostCard(post) {
    return `
        <article class="post-card">
            <div class="post-image" style="background-image: url('${post.image || '/assets/images/default-post.jpg'}')"></div>
            <div class="post-content">
                <div class="post-meta">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(post.date)}</span>
                    <i class="fas fa-clock"></i>
                    <span>${post.readTime}</span>
                    ${post.featured ? '<i class="fas fa-star" title="Featured Post"></i>' : ''}
                </div>
                <h2 class="post-title">
                    <a href="/blog/${post.slug}/">${post.title}</a>
                </h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.slice(0, 4).map(tag => `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`).join('')}
                </div>
                <div class="post-footer">
                    <a href="/blog/${post.slug}/" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="post-stats">
                        <span class="post-stat">
                            <i class="fas fa-eye"></i>
                            <span>${Math.floor(Math.random() * 500) + 50}</span>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// ===== LOAD MORE FUNCTIONALITY =====
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            displayPosts();
            
            // Smooth scroll to new content
            setTimeout(() => {
                const newPosts = document.querySelectorAll('.post-card');
                if (newPosts.length > 0) {
                    const targetPost = newPosts[Math.max(0, (currentPage - 1) * postsPerPage)];
                    if (targetPost) {
                        targetPost.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }
            }, 100);
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function filterByTag(tag) {
    // Update active filter
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(t => t.classList.remove('active'));
    
    const targetTag = document.querySelector(`[data-tag="${tag}"]`);
    if (targetTag) {
        targetTag.classList.add('active');
    }
    
    currentFilter = tag;
    currentPage = 1;
    applyFilters();
    
    // Scroll to top of posts
    const postsSection = document.querySelector('.blog-posts');
    if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function animatePostCards() {
    const postCards = document.querySelectorAll('.post-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    postCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== NEWSLETTER FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            // Simulate subscription process
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.backgroundColor = '';
                    this.reset();
                }, 2000);
            }, 1000);
        });
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Focus search with '/' key
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Clear search with 'Escape' key
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        if (searchInput && searchInput === document.activeElement) {
            searchInput.blur();
            searchInput.value = '';
            searchQuery = '';
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            applyFilters();
        }
    }
});
