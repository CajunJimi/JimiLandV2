// ===== CALENDAR PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calendarGrid = document.getElementById('calendar-grid');
    const eventsList = document.getElementById('events-list');
    const noEventsMessage = document.getElementById('no-events');
    const currentMonthElement = document.getElementById('current-month');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const todayBtn = document.getElementById('today-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const monthView = document.getElementById('month-view');
    const listView = document.getElementById('list-view');
    const eventModal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    
    // State
    let currentDate = new Date();
    let currentView = 'month';
    let allEvents = [];
    
    // Sample events data
    const sampleEvents = [
        {
            id: 1,
            title: "Summer Acoustic Session",
            type: "gig",
            date: "2025-07-15",
            time: "8:00 PM",
            location: "The Blue Note, Nashville, TN",
            description: "An intimate acoustic evening featuring original songs and covers.",
            ticketUrl: "https://example.com/tickets/1"
        },
        {
            id: 2,
            title: "Studio Recording Session",
            type: "recording",
            date: "2025-07-20",
            time: "2:00 PM",
            location: "Abbey Road Studios",
            description: "Recording new tracks for the upcoming album.",
            ticketUrl: null
        },
        {
            id: 3,
            title: "Music Festival Main Stage",
            type: "gig",
            date: "2025-09-12",
            time: "7:30 PM",
            location: "Harmony Festival, Austin, TX",
            description: "Main stage performance at the annual Harmony Music Festival.",
            ticketUrl: "https://example.com/tickets/3"
        },
        {
            id: 4,
            title: "Birthday Celebration",
            type: "personal",
            date: "2025-08-15",
            time: "6:00 PM",
            location: "Private Venue",
            description: "Personal birthday celebration with friends and family.",
            ticketUrl: null
        },
        {
            id: 5,
            title: "Charity Concert",
            type: "gig",
            date: "2025-10-05",
            time: "7:00 PM",
            location: "Community Center",
            description: "Benefit concert for local music education programs.",
            ticketUrl: "https://example.com/tickets/5"
        },
        {
            id: 6,
            title: "Podcast Interview",
            type: "other",
            date: "2025-07-25",
            time: "10:00 AM",
            location: "Radio Station",
            description: "Interview about the new album and upcoming tour.",
            ticketUrl: null
        }
    ];
    
    // Initialize
    init();
    
    function init() {
        loadEvents();
        setupEventListeners();
        updateCalendar();
    }
    
    function loadEvents() {
        // In a real app, you might load from /assets/data/events.json
        allEvents = sampleEvents;
        console.log('Loaded', allEvents.length, 'events');
    }
    
    function setupEventListeners() {
        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
        
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            updateCalendar();
        });
        
        // View buttons
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                setActiveView(this, view);
            });
        });
        
        // Modal close
        modalClose.addEventListener('click', closeModal);
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }
    
    function setActiveView(activeBtn, view) {
        viewBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        currentView = view;
        
        if (view === 'month') {
            monthView.classList.add('active');
            listView.classList.remove('active');
            updateCalendar();
        } else {
            monthView.classList.remove('active');
            listView.classList.add('active');
            updateEventsList();
        }
    }
    
    function updateCalendar() {
        updateCurrentMonthDisplay();
        
        if (currentView === 'month') {
            generateCalendarGrid();
        } else {
            updateEventsList();
        }
    }
    
    function updateCurrentMonthDisplay() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    function generateCalendarGrid() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Get previous month's last days
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        let html = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-header-cell">${day}</div>`;
        });
        
        // Add previous month's trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-cell other-month">
                <div class="cell-date">${day}</div>
                <div class="cell-events"></div>
            </div>`;
        }
        
        // Add current month's days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const isToday = cellDate.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(cellDate);
            
            let cellClass = 'calendar-cell';
            if (isToday) cellClass += ' today';
            if (dayEvents.length > 0) cellClass += ' has-events';
            
            html += `<div class="${cellClass}" data-date="${formatDate(cellDate)}">
                <div class="cell-date">${day}</div>
                <div class="cell-events">
                    ${generateEventDots(dayEvents)}
                </div>
            </div>`;
        }
        
        // Add next month's leading days
        const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-cell other-month">
                <div class="cell-date">${day}</div>
                <div class="cell-events"></div>
            </div>`;
        }
        
        calendarGrid.innerHTML = html;
        
        // Add click listeners to calendar cells
        const cells = calendarGrid.querySelectorAll('.calendar-cell:not(.other-month)');
        cells.forEach(cell => {
            cell.addEventListener('click', function() {
                const date = this.dataset.date;
                const events = getEventsForDate(new Date(date));
                if (events.length > 0) {
                    showEventsModal(date, events);
                }
            });
        });
        
        // Add click listeners to event dots
        const eventDots = calendarGrid.querySelectorAll('.event-dot');
        eventDots.forEach(dot => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                const eventId = parseInt(this.dataset.eventId);
                const event = allEvents.find(e => e.id === eventId);
                if (event) {
                    showEventModal(event);
                }
            });
        });
    }
    
    function getEventsForDate(date) {
        const dateString = formatDate(date);
        return allEvents.filter(event => event.date === dateString);
    }
    
    function generateEventDots(events) {
        const maxVisible = 3;
        let html = '';
        
        for (let i = 0; i < Math.min(events.length, maxVisible); i++) {
            const event = events[i];
            html += `<div class="event-dot ${event.type}" data-event-id="${event.id}" title="${event.title}">${event.title}</div>`;
        }
        
        if (events.length > maxVisible) {
            html += `<div class="more-events">+${events.length - maxVisible} more</div>`;
        }
        
        return html;
    }
    
    function updateEventsList() {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Filter events for current month
        const monthEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        });
        
        // Sort events by date
        monthEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (monthEvents.length === 0) {
            eventsList.classList.add('hidden');
            noEventsMessage.classList.remove('hidden');
            return;
        }
        
        eventsList.classList.remove('hidden');
        noEventsMessage.classList.add('hidden');
        
        eventsList.innerHTML = monthEvents.map(event => createEventItem(event)).join('');
        
        // Add click listeners
        const eventItems = eventsList.querySelectorAll('.event-item');
        eventItems.forEach(item => {
            item.addEventListener('click', function() {
                const eventId = parseInt(this.dataset.eventId);
                const event = allEvents.find(e => e.id === eventId);
                if (event) {
                    showEventModal(event);
                }
            });
        });
    }
    
    function createEventItem(event) {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <div class="event-item ${event.type}" data-event-id="${event.id}">
                <div class="event-header">
                    <div>
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-details">
                            <div class="event-detail">
                                <i class="fas fa-calendar"></i>
                                ${formattedDate}
                            </div>
                            <div class="event-detail">
                                <i class="fas fa-clock"></i>
                                ${event.time}
                            </div>
                            <div class="event-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                ${event.location}
                            </div>
                        </div>
                    </div>
                    <div class="event-type ${event.type}">${event.type}</div>
                </div>
                <p class="event-description">${event.description}</p>
            </div>
        `;
    }
    
    function showEventsModal(date, events) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modalTitle.textContent = `Events for ${formattedDate}`;
        modalBody.innerHTML = events.map(event => `
            <div class="modal-event" data-event-id="${event.id}">
                <h4>${event.title}</h4>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
                ${event.ticketUrl ? `<a href="${event.ticketUrl}" target="_blank" class="btn btn-primary">Get Tickets</a>` : ''}
            </div>
        `).join('<hr>');
        
        eventModal.classList.remove('hidden');
    }
    
    function showEventModal(event) {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modalTitle.textContent = event.title;
        modalBody.innerHTML = `
            <div class="modal-event">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Type:</strong> ${event.type}</p>
                <p>${event.description}</p>
                ${event.ticketUrl ? `<a href="${event.ticketUrl}" target="_blank" class="btn btn-primary">Get Tickets</a>` : ''}
            </div>
        `;
        
        eventModal.classList.remove('hidden');
    }
    
    function closeModal() {
        eventModal.classList.add('hidden');
    }
    
    function handleKeyboard(e) {
        if (isInputFocused()) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentView === 'month') {
                    prevBtn.click();
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
                if (currentView === 'month') {
                    nextBtn.click();
                    e.preventDefault();
                }
                break;
            case 't':
                todayBtn.click();
                e.preventDefault();
                break;
            case 'm':
                document.querySelector('[data-view="month"]').click();
                e.preventDefault();
                break;
            case 'l':
                document.querySelector('[data-view="list"]').click();
                e.preventDefault();
                break;
            case 'Escape':
                closeModal();
                break;
        }
    }
    
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.contentEditable === 'true'
        );
    }
    
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
});
