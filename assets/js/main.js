// ===== MAIN JAVASCRIPT FOR JIMILAND =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHeroScroll();
    loadRecentPosts();
    initializeAnimations();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect - maintain black theme
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== HERO SCROLL =====
function initializeHeroScroll() {
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const featuredSection = document.querySelector('.featured');
            if (featuredSection) {
                featuredSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ===== LOAD RECENT POSTS =====
async function loadRecentPosts() {
    const postsContainer = document.getElementById('recent-posts');
    if (!postsContainer) return;

    try {
        // Try to load posts from JSON file
        const response = await fetch('/assets/data/posts.json');
        if (response.ok) {
            const posts = await response.json();
            displayRecentPosts(posts.slice(0, 3)); // Show only 3 recent posts
        } else {
            // Fallback to sample posts if JSON doesn't exist
            displaySamplePosts();
        }
    } catch (error) {
        console.log('Posts data not found, showing sample posts');
        displaySamplePosts();
    }
}

function displayRecentPosts(posts) {
    const postsContainer = document.getElementById('recent-posts');
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-image" style="background-image: url('${post.image || '/assets/images/default-post.jpg'}')"></div>
            <div class="post-content">
                <div class="post-meta">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(post.date)}</span>
                    <i class="fas fa-clock"></i>
                    <span>${post.readTime || '5 min read'}</span>
                </div>
                <h3 class="post-title">
                    <a href="/blog/${post.slug}/">${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

function displaySamplePosts() {
    const samplePosts = [
        {
            title: "Welcome to JimiLand",
            excerpt: "Starting fresh with a new blog about music, gigs, and life adventures. Here's what you can expect...",
            date: "2025-06-28",
            tags: ["welcome", "music", "blog"],
            slug: "welcome-to-jimiland",
            readTime: "3 min read"
        },
        {
            title: "The Magic of Live Music",
            excerpt: "There's something special about live performances that recorded music just can't capture...",
            date: "2025-06-25",
            tags: ["music", "live", "performance"],
            slug: "magic-of-live-music",
            readTime: "6 min read"
        },
        {
            title: "Upcoming Gig Schedule",
            excerpt: "Excited to announce some upcoming performances! Here's where you can catch me live...",
            date: "2025-06-20",
            tags: ["gigs", "schedule", "events"],
            slug: "upcoming-gig-schedule",
            readTime: "4 min read"
        }
    ];

    displayRecentPosts(samplePosts);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.featured-card, .post-card, .section-title');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
}

async function performSearch(query) {
    try {
        const response = await fetch('/assets/data/posts.json');
        if (!response.ok) return;
        
        const posts = await response.json();
        const results = posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No posts found</p>';
    } else {
        searchResults.innerHTML = results.map(post => `
            <div class="search-result">
                <h4><a href="/blog/${post.slug}/">${post.title}</a></h4>
                <p>${post.excerpt}</p>
                <div class="search-meta">
                    <span>${formatDate(post.date)}</span>
                    <div class="search-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

// ===== THEME TOGGLE (Optional) =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// ===== LAZY LOADING FOR IMAGES =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
