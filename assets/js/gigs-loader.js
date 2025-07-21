/**
 * Gigs Loader - Dynamically loads gigs from JSON data
 */

class GigsLoader {
    constructor() {
        this.gigs = [];
        this.filteredGigs = [];
        this.currentFilter = 'upcoming';
        this.currentView = 'list';
        this.currentDate = new Date();
        this.gigsContainer = null;
        this.calendarContainer = null;
        this.undatedGigsContainer = null;
    }

    /**
     * Initialize the gigs loader
     */
    async init() {
        try {
            await this.loadGigs();
            this.setupDOM();
            this.setupFilters();
            this.setupViewSwitching();
            this.renderGigs();
        } catch (error) {
            console.error('Failed to initialize gigs loader:', error);
            this.showError();
        }
    }

    /**
     * Load gigs from JSON file
     */
    async loadGigs() {
        try {
            const response = await fetch('/data/gigs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.gigs = await response.json();
            console.log(`Loaded ${this.gigs.length} gigs`);
        } catch (error) {
            console.error('Error loading gigs:', error);
            this.gigs = [];
        }
    }

    /**
     * Setup DOM elements
     */
    setupDOM() {
        this.gigsContainer = document.querySelector('#gigs-grid');
        if (!this.gigsContainer) {
            console.error('Gigs container not found');
            return;
        }
    }

    /**
     * Setup filter functionality
     */
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-tab');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Set current filter
                this.currentFilter = button.dataset.filter || 'all';
                
                // Handle song tracker filter
                if (this.currentFilter === 'songs') {
                    this.showSongTracker();
                } else {
                    this.hideSongTracker();
                    // Re-render gigs for other filters
                    this.renderGigs();
                }
            });
        });
    }

    /**
     * Render gigs to the DOM
     */
    renderGigs() {
        if (!this.gigsContainer) return;

        // Clear existing content
        this.gigsContainer.innerHTML = '';

        // Filter gigs based on current filter
        this.filteredGigs = this.filterGigs(this.gigs);

        // Sort by date (most recent first, undated gigs at the end)
        this.filteredGigs.sort((a, b) => {
            // Handle undated gigs - put them at the end
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            
            // Sort dated gigs by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });

        if (this.filteredGigs.length === 0) {
            this.showNoGigs();
            return;
        }

        // Render each gig
        this.filteredGigs.forEach(gig => {
            const gigElement = this.createGigElement(gig);
            this.gigsContainer.appendChild(gigElement);
        });
    }

    /**
     * Filter gigs based on current filter
     */
    filterGigs(gigs) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for date-only comparison
        
        switch (this.currentFilter) {
            case 'upcoming':
                return gigs.filter(gig => {
                    if (!gig.date) return false;
                    const gigDate = new Date(gig.date);
                    gigDate.setHours(0, 0, 0, 0);
                    return gigDate >= today;
                });
            case 'past':
                return gigs.filter(gig => {
                    if (!gig.date) return false;
                    const gigDate = new Date(gig.date);
                    gigDate.setHours(0, 0, 0, 0);
                    return gigDate < today;
                });
            case 'all':
            default:
                return gigs;
        }
    }

    /**
     * Create a gig element
     */
    createGigElement(gig) {
        const article = document.createElement('article');
        article.className = 'post-card gig-card';
        
        const date = document.createElement('time');
        date.className = 'gig-date';
        date.textContent = this.formatDate(gig.date);
        
        const title = document.createElement('h3');
        title.className = 'gig-title';
        // Use artist name as title if available, otherwise venue name if gig title is generic
        let displayTitle = gig.title;
        if (gig.title === 'Untitled Gig' || !gig.title) {
            displayTitle = gig.artist || gig.venue || 'TBA';
        }
        title.textContent = displayTitle;
        
        const venue = document.createElement('div');
        venue.className = 'gig-venue';
        // Only show venue separately if it's not already used as the title
        const showVenue = gig.venue && displayTitle !== gig.venue;
        if (showVenue) {
            venue.textContent = gig.venue;
        }
        
        // Add artist info if we have it and it's not already the title
        const artist = document.createElement('div');
        artist.className = 'gig-artist';
        const showArtist = gig.artist && displayTitle !== gig.artist;
        if (showArtist) {
            artist.textContent = gig.artist;
        }
        
        const location = document.createElement('div');
        location.className = 'gig-location';
        location.textContent = gig.location || '';
        
        article.appendChild(date);
        article.appendChild(title);
        if (showArtist) article.appendChild(artist);
        if (showVenue) article.appendChild(venue);
        if (gig.location) article.appendChild(location);
        
        // No click handlers - keep gigs on site only
        
        return article;
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Generate calendar view
     */
    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update calendar title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarTitle = document.getElementById('calendar-title');
        if (calendarTitle) {
            calendarTitle.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Get calendar grid
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;
        
        // Clear existing calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = 'background: #333; color: #fff; padding: 0.5rem; text-align: center; font-weight: bold;';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Check if it's today
            const currentDay = new Date(year, month, day);
            if (currentDay.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            // Add gigs for this day
            const dayGigs = this.getGigsForDate(year, month, day);
            if (dayGigs.length > 0) {
                const gigsContainer = document.createElement('div');
                gigsContainer.className = 'day-gigs';
                
                dayGigs.forEach(gig => {
                    const gigItem = document.createElement('div');
                    gigItem.className = 'gig-item';
                    
                    const gigDot = document.createElement('span');
                    gigDot.className = `gig-dot ${this.isUpcoming(gig.date) ? 'upcoming' : 'past'}`;
                    
                    const gigText = document.createElement('span');
                    // Use artist name as title if available, otherwise venue name if gig title is generic
                    let displayTitle = gig.title;
                    if (gig.title === 'Untitled Gig' || !gig.title) {
                        displayTitle = gig.artist || gig.venue || 'TBA';
                    }
                    gigText.textContent = displayTitle;
                    
                    gigItem.appendChild(gigDot);
                    gigItem.appendChild(gigText);
                    gigsContainer.appendChild(gigItem);
                });
                
                dayElement.appendChild(gigsContainer);
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    /**
     * Get gigs for a specific date
     */
    getGigsForDate(year, month, day) {
        const targetDate = new Date(year, month, day);
        const targetDateString = targetDate.toISOString().split('T')[0];
        
        return this.gigs.filter(gig => {
            if (!gig.date) return false;
            const gigDate = new Date(gig.date).toISOString().split('T')[0];
            return gigDate === targetDateString;
        });
    }
    
    /**
     * Render undated gigs
     */
    renderUndatedGigs() {
        const undatedGigsList = document.getElementById('undated-gigs-list');
        const undatedGigsSection = document.getElementById('undated-gigs');
        
        if (!undatedGigsList || !undatedGigsSection) return;
        
        // Get gigs without dates
        const undatedGigs = this.gigs.filter(gig => !gig.date || gig.date === '');
        
        if (undatedGigs.length === 0) {
            undatedGigsSection.style.display = 'none';
            return;
        }
        
        undatedGigsSection.style.display = 'block';
        undatedGigsList.innerHTML = '';
        
        undatedGigs.forEach(gig => {
            const gigElement = document.createElement('div');
            gigElement.className = 'undated-gig';
            
            gigElement.innerHTML = `
                <h4>${gig.title || 'Untitled Gig'}</h4>
                <p><strong>Venue:</strong> ${gig.venue || 'TBA'}</p>
                ${gig.location ? `<p><strong>Location:</strong> ${gig.location}</p>` : ''}
                <p><strong>Status:</strong> ${gig.status || 'TBA'}</p>
            `;
            
            undatedGigsList.appendChild(gigElement);
        });
    }
    
    /**
     * Setup view switching
     */
    setupViewSwitching() {
        const viewTabs = document.querySelectorAll('.view-tab');
        const listView = document.getElementById('gigs-grid');
        const calendarView = document.getElementById('calendar-container');
        
        viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                
                // Update active tab
                viewTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Switch views
                if (view === 'calendar') {
                    listView?.classList.add('hidden');
                    calendarView?.classList.remove('hidden');
                    this.currentView = 'calendar';
                    this.generateCalendar();
                    this.renderUndatedGigs();
                } else {
                    listView?.classList.remove('hidden');
                    calendarView?.classList.add('hidden');
                    this.currentView = 'list';
                }
            });
        });
        
        // Setup calendar navigation
        const prevButton = document.getElementById('prev-month');
        const nextButton = document.getElementById('next-month');
        
        prevButton?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.generateCalendar();
        });
        
        nextButton?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.generateCalendar();
        });
    }

    /**
     * Show error message
     */
    showError() {
        if (!this.gigsContainer) return;
        
        this.gigsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load gigs. Please try again later.</p>
            </div>
        `;
    }

    /**
     * Show no gigs message
     */
    showNoGigs() {
        const filterText = this.currentFilter === 'all' ? '' : ` ${this.currentFilter}`;
        this.gigsContainer.innerHTML = `
            <div class="no-gigs">
                <p>No${filterText} gigs available.</p>
            </div>
        `;
    }

        
/**
 * Render undated gigs
 */
renderUndatedGigs() {
    const undatedGigsList = document.getElementById('undated-gigs-list');
    const undatedGigsSection = document.getElementById('undated-gigs');
            
    if (!undatedGigsList || !undatedGigsSection) return;
            
    // Get gigs without dates
    const undatedGigs = this.gigs.filter(gig => !gig.date || gig.date === '');
            
    if (undatedGigs.length === 0) {
        undatedGigsSection.style.display = 'none';
        return;
    }
            
    undatedGigsSection.style.display = 'block';
    undatedGigsList.innerHTML = '';
            
    undatedGigs.forEach(gig => {
        const gigElement = document.createElement('div');
        gigElement.className = 'undated-gig';
                
        gigElement.innerHTML = `
            <h4>${gig.title || 'Untitled Gig'}</h4>
            <p><strong>Venue:</strong> ${gig.venue || 'TBA'}</p>
            ${gig.location ? `<p><strong>Location:</strong> ${gig.location}</p>` : ''}
            <p><strong>Status:</strong> ${gig.status || 'TBA'}</p>
        `;
                
        undatedGigsList.appendChild(gigElement);
    });
}
        
/**
 * Setup view switching
 */
setupViewSwitching() {
    const viewTabs = document.querySelectorAll('.view-tab');
    const listView = document.getElementById('gigs-grid');
    const calendarView = document.getElementById('calendar-container');
            
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
                    
            // Update active tab
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
                    
            // Switch views
            if (view === 'calendar') {
                listView?.classList.add('hidden');
                calendarView?.classList.remove('hidden');
                this.currentView = 'calendar';
                this.generateCalendar();
                this.renderUndatedGigs();
            } else {
                listView?.classList.remove('hidden');
                calendarView?.classList.add('hidden');
                this.currentView = 'list';
            }
        });
    });
            
    // Setup calendar navigation
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
            
    prevButton?.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.generateCalendar();
    });
            
    nextButton?.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.generateCalendar();
    });
}

/**
 * Show error message
 */
showError() {
    if (!this.gigsContainer) return;
            
    this.gigsContainer.innerHTML = `
        <div class="error-message">
            <p>Unable to load gigs. Please try again later.</p>
        </div>
    `;
}

/**
 * Show no gigs message
 */
showNoGigs() {
    const filterText = this.currentFilter === 'all' ? '' : ` ${this.currentFilter}`;
    this.gigsContainer.innerHTML = `
        <div class="no-gigs">
            <p>No${filterText} gigs available.</p>
        </div>
    `;
}

/**
 * Check if a gig date is upcoming (today or future)
 */
isUpcoming(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gigDate = new Date(dateString);
    gigDate.setHours(0, 0, 0, 0);
    return gigDate >= today;
}

/**
 * Show song tracker and hide gigs content
 */
showSongTracker() {
    // Hide gigs-related elements
    this.hideGigsContent();
            
    // Show song tracker
    if (window.songTracker) {
        window.songTracker.show();
        // Load songs if not already loaded
        if (window.songTracker.songs.length === 0) {
            window.songTracker.loadSongs();
        }
    }
}

/**
 * Hide song tracker and show gigs content
 */
hideSongTracker() {
    // Hide song tracker
    if (window.songTracker) {
        window.songTracker.hide();
    }
            
    // Show gigs content
    this.showGigsContent();
}

/**
 * Hide gigs-related content
 */
hideGigsContent() {
    const elementsToHide = [
        this.gigsContainer,
        this.calendarContainer,
        this.undatedGigsContainer,
        document.getElementById('no-gigs'),
        document.querySelector('.view-tabs')
    ];
            
    elementsToHide.forEach(element => {
        if (element) {
            element.classList.add('hidden');
        }
    });
}

/**
 * Show gigs-related content
 */
showGigsContent() {
    const elementsToShow = [
        this.gigsContainer,
        document.querySelector('.view-tabs')
    ];
            
    elementsToShow.forEach(element => {
        if (element) {
            element.classList.remove('hidden');
        }
    });
            
    // Show calendar or undated gigs based on current view
    if (this.currentView === 'calendar') {
        if (this.calendarContainer) {
            this.calendarContainer.classList.remove('hidden');
        }
    } else {
        if (this.undatedGigsContainer) {
            this.undatedGigsContainer.classList.remove('hidden');
        }
    }
}

/**
 * Fallback sample gigs data
 */
    /**
     * Fallback sample gigs data
     */

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gigsLoader = new GigsLoader();
    gigsLoader.init();
});

// Export for use in other scripts
window.GigsLoader = GigsLoader;
