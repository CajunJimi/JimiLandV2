// ===== GIGS PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gigsGrid = document.getElementById('gigs-grid');
    const noGigsMessage = document.getElementById('no-gigs');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // State
    let allGigs = [];
    let currentFilter = 'upcoming';
    
    // Sample gigs data (in a real app, this would come from a JSON file or API)
    const sampleGigs = [
        {
            id: 1,
            title: "Summer Acoustic Session",
            venue: "The Blue Note",
            location: "Nashville, TN",
            date: "2025-07-15",
            time: "8:00 PM",
            status: "upcoming",
            type: "acoustic",
            price: "$25",
            ticketUrl: "https://example.com/tickets/1",
            description: "An intimate acoustic evening featuring original songs and covers.",
            featured: true,
            tags: ["acoustic", "intimate", "originals"]
        },
        {
            id: 2,
            title: "Electric Blues Night",
            venue: "Rock & Roll Hall",
            location: "Memphis, TN",
            date: "2025-08-03",
            time: "9:00 PM",
            status: "upcoming",
            type: "electric",
            price: "$35",
            ticketUrl: "https://example.com/tickets/2",
            description: "High-energy electric blues performance with full band.",
            featured: false,
            tags: ["electric", "blues", "full-band"]
        },
        {
            id: 3,
            title: "Music Festival Main Stage",
            venue: "Harmony Festival",
            location: "Austin, TX",
            date: "2025-09-12",
            time: "7:30 PM",
            status: "sold-out",
            type: "festival",
            price: "$75",
            ticketUrl: null,
            description: "Main stage performance at the annual Harmony Music Festival.",
            featured: true,
            tags: ["festival", "main-stage", "electric"]
        },
        {
            id: 4,
            title: "Coffee House Sessions",
            venue: "Grind Coffee",
            location: "Portland, OR",
            date: "2024-12-15",
            time: "7:00 PM",
            status: "past",
            type: "acoustic",
            price: "$15",
            ticketUrl: null,
            description: "Cozy coffee house performance with acoustic guitar and vocals.",
            featured: false,
            tags: ["acoustic", "coffee-house", "intimate"]
        },
        {
            id: 5,
            title: "New Year's Eve Celebration",
            venue: "Downtown Arena",
            location: "Chicago, IL",
            date: "2024-12-31",
            time: "10:00 PM",
            status: "past",
            type: "electric",
            price: "$50",
            ticketUrl: null,
            description: "Ring in the new year with an electric performance!",
            featured: true,
            tags: ["electric", "celebration", "new-year"]
        }
    ];
    
    // Initialize
    init();
    
    function init() {
        loadGigs();
        setupEventListeners();
        filterGigs(currentFilter);
    }
    
    function loadGigs() {
        // In a real app, you might load from /assets/data/gigs.json
        // For now, we'll use the sample data
        allGigs = sampleGigs;
        console.log('Loaded', allGigs.length, 'gigs');
    }
    
    function setupEventListeners() {
        // Filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.dataset.filter;
                setActiveFilter(this);
                filterGigs(filter);
            });
        });
    }
    
    function setActiveFilter(activeTab) {
        filterTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
        currentFilter = activeTab.dataset.filter;
    }
    
    function filterGigs(filter) {
        let filteredGigs = [];
        
        switch(filter) {
            case 'upcoming':
                filteredGigs = allGigs.filter(gig => gig.status === 'upcoming' || gig.status === 'sold-out');
                break;
            case 'past':
                filteredGigs = allGigs.filter(gig => gig.status === 'past');
                break;
            case 'all':
            default:
                filteredGigs = allGigs;
                break;
        }
        
        // Sort gigs by date
        filteredGigs.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            if (filter === 'past') {
                return dateB - dateA; // Most recent first for past gigs
            } else {
                return dateA - dateB; // Earliest first for upcoming gigs
            }
        });
        
        displayGigs(filteredGigs);
    }
    
    function displayGigs(gigs) {
        if (gigs.length === 0) {
            gigsGrid.classList.add('hidden');
            noGigsMessage.classList.remove('hidden');
            return;
        }
        
        gigsGrid.classList.remove('hidden');
        noGigsMessage.classList.add('hidden');
        
        gigsGrid.innerHTML = gigs.map(gig => createGigCard(gig)).join('');
        
        // Add animation
        const gigCards = gigsGrid.querySelectorAll('.gig-card');
        gigCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    function createGigCard(gig) {
        const date = new Date(gig.date);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        const year = date.getFullYear();
        
        const statusClass = gig.status;
        const featuredClass = gig.featured ? 'featured' : '';
        
        const statusText = {
            'upcoming': 'Upcoming',
            'sold-out': 'Sold Out',
            'past': 'Past Show'
        }[gig.status] || 'Unknown';
        
        const ticketButton = gig.ticketUrl && gig.status === 'upcoming' 
            ? `<a href="${gig.ticketUrl}" class="gig-button" target="_blank" rel="noopener">Get Tickets</a>`
            : gig.status === 'sold-out'
            ? `<button class="gig-button disabled">Sold Out</button>`
            : `<button class="gig-button disabled">No Tickets</button>`;
        
        const tags = gig.tags.map(tag => `<span class="gig-tag ${tag}">${tag}</span>`).join('');
        
        return `
            <div class="gig-card ${statusClass} ${featuredClass}">
                <div class="gig-date">
                    <div class="gig-month">${month}</div>
                    <div class="gig-day">${day}</div>
                    <div class="gig-year">${year}</div>
                </div>
                
                <div class="gig-info">
                    <h3 class="gig-title">${gig.title}</h3>
                    <div class="gig-venue">${gig.venue}</div>
                    <div class="gig-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${gig.location}
                    </div>
                    <div class="gig-details">
                        <div class="gig-detail">
                            <i class="fas fa-clock"></i>
                            ${gig.time}
                        </div>
                        <div class="gig-detail">
                            <i class="fas fa-dollar-sign"></i>
                            ${gig.price}
                        </div>
                        <div class="gig-detail">
                            <i class="fas fa-music"></i>
                            ${gig.type}
                        </div>
                    </div>
                    <div class="gig-tags">
                        ${tags}
                    </div>
                </div>
                
                <div class="gig-actions">
                    <div class="gig-status ${statusClass}">${statusText}</div>
                    ${ticketButton}
                </div>
            </div>
        `;
    }
    
    // Utility function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'u' for upcoming gigs
        if (e.key === 'u' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const upcomingTab = document.querySelector('[data-filter="upcoming"]');
            if (upcomingTab && !isInputFocused()) {
                upcomingTab.click();
                e.preventDefault();
            }
        }
        
        // Press 'p' for past gigs
        if (e.key === 'p' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const pastTab = document.querySelector('[data-filter="past"]');
            if (pastTab && !isInputFocused()) {
                pastTab.click();
                e.preventDefault();
            }
        }
        
        // Press 'a' for all gigs
        if (e.key === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const allTab = document.querySelector('[data-filter="all"]');
            if (allTab && !isInputFocused()) {
                allTab.click();
                e.preventDefault();
            }
        }
    });
    
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.contentEditable === 'true'
        );
    }
    
    // Add scroll animations for gig cards
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
    
    // Observe gig cards when they're added to the DOM
    function observeGigCards() {
        const gigCards = document.querySelectorAll('.gig-card');
        gigCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Call this after displaying gigs
    setTimeout(observeGigCards, 100);
});
