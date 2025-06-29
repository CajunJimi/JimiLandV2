document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeline = document.getElementById('timeline');
    const noItemsMessage = document.getElementById('no-items');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // State
    let allItems = [];
    let currentFilter = 'all';
    
    // Load real data from JSON files
    async function loadRealData() {
        try {
            const [postsResponse, gigsResponse] = await Promise.all([
                fetch('/data/posts.json'),
                fetch('/data/gigs.json')
            ]);
            
            const posts = await postsResponse.json();
            const gigs = await gigsResponse.json();
            
            // Convert posts to archive format
            const postItems = posts.filter(post => post.published).map(post => ({
                id: post.id,
                type: 'post',
                title: post.title,
                description: post.excerpt,
                date: post.date,
                link: post.url,
                category: 'Music'
            }));
            
            // Convert gigs to archive format (only recent/upcoming ones)
            const currentDate = new Date();
            const sixMonthsAgo = new Date(currentDate.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
            
            const gigItems = gigs
                .filter(gig => new Date(gig.date) >= sixMonthsAgo)
                .map(gig => ({
                    id: gig.id,
                    type: 'gig',
                    title: gig.title || gig.name,
                    description: gig.description || `${gig.venue}, ${gig.location}`,
                    date: gig.date,
                    venue: gig.venue,
                    location: gig.location,
                    status: new Date(gig.date) > currentDate ? 'upcoming' : 'past'
                }));
            
            return [...postItems, ...gigItems].sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error loading data:', error);
            return [];
        }
    }
    
    async function init() {
        setupEventListeners();
        await loadArchiveData();
        filterItems(currentFilter);
    }
    
    async function loadArchiveData() {
        try {
            allItems = await loadRealData();
            renderTimeline(allItems);
        } catch (error) {
            console.error('Failed to load archive data:', error);
            allItems = [];
            renderTimeline(allItems);
        }
    }
    
    function setupEventListeners() {
        // Filter tab clicks
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.dataset.filter;
                setActiveFilter(this);
                filterItems(filter);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
                return;
            }
            
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    setActiveFilterByValue('all');
                    break;
                case '2':
                    e.preventDefault();
                    setActiveFilterByValue('posts');
                    break;
                case '3':
                    e.preventDefault();
                    setActiveFilterByValue('gigs');
                    break;
                case '4':
                    e.preventDefault();
                    setActiveFilterByValue('site');
                    break;
            }
        });
    }
    
    function setActiveFilter(activeTab) {
        filterTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
        currentFilter = activeTab.dataset.filter;
    }
    
    function setActiveFilterByValue(filter) {
        const tab = document.querySelector(`[data-filter="${filter}"]`);
        if (tab) {
            setActiveFilter(tab);
            filterItems(filter);
        }
    }
    
    function filterItems(filter) {
        let filteredItems = [];
        
        switch(filter) {
            case 'posts':
                filteredItems = allItems.filter(item => item.type === 'post');
                break;
            case 'gigs':
                filteredItems = allItems.filter(item => item.type === 'gig');
                break;
            case 'site':
                filteredItems = allItems.filter(item => item.type === 'site');
                break;
            case 'all':
            default:
                filteredItems = allItems;
                break;
        }
        
        renderTimeline(filteredItems);
    }
    
    function renderTimeline(items) {
        if (items.length === 0) {
            timeline.innerHTML = '';
            noItemsMessage.classList.remove('hidden');
            return;
        }
        
        noItemsMessage.classList.add('hidden');
        
        const timelineHTML = items.map((item, index) => {
            return createTimelineItem(item, index);
        }).join('');
        
        timeline.innerHTML = timelineHTML;
        
        // Trigger animations
        setTimeout(() => {
            const timelineItems = timeline.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }
    
    function createTimelineItem(item, index) {
        const formattedDate = formatDate(item.date);
        const typeClass = item.type;
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        
        let actionsHTML = '';
        if (item.type === 'post' && item.link) {
            actionsHTML = `<div class="timeline-actions">
                <a href="${item.link}" class="timeline-link">Read Post</a>
            </div>`;
        } else if (item.type === 'gig') {
            const statusText = item.status === 'upcoming' ? 'Upcoming' : 'Past Event';
            actionsHTML = `<div class="timeline-actions">
                <span class="timeline-link">${item.venue}, ${item.location}</span>
                <span class="timeline-link">${statusText}</span>
            </div>`;
        }
        
        return `
            <div class="timeline-item" style="opacity: 0; transform: translateY(20px);">
                <div class="timeline-marker ${typeClass}"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">${item.title}</h3>
                        <div class="timeline-meta">
                            <span class="timeline-type ${typeClass}">${typeLabel}</span>
                            <time datetime="${item.date}">${formattedDate}</time>
                        </div>
                    </div>
                    <p class="timeline-description">${item.description}</p>
                    ${actionsHTML}
                </div>
            </div>
        `;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Export functions for potential external use
    window.ArchivePage = {
        filterItems: filterItems,
        addItem: function(item) {
            allItems.unshift(item);
            allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            filterItems(currentFilter);
        }
    };
    
    // Initialize the archive
    init();
});
