// JimiLand - Main JavaScript Application

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname;
    
    if (currentPage === '/' || currentPage === '/index.html') {
        initHomePage();
    } else if (currentPage.includes('/archive/')) {
        initArchivePage();
    } else if (currentPage.includes('/gigs/')) {
        initGigsPage();
    } else if (currentPage.includes('/projects/')) {
        initProjectsPage();
    }
});

// =====================
// HOME PAGE
// =====================
async function initHomePage() {
    try {
        const posts = await loadPosts();
        renderHomePosts(posts.slice(0, 5));
    } catch (error) {
        console.error('Failed to load home posts:', error);
        showError('posts-container');
    }
}

function renderHomePosts(posts) {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-results">No posts available yet.</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="post-card" onclick="window.location.href='${post.url}'">
            <time class="post-date">${formatDate(post.date)}</time>
            <h3 class="post-title">${post.title}</h3>
            ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
        </div>
    `).join('');
}

// =====================
// ARCHIVE PAGE
// =====================
async function initArchivePage() {
    try {
        const posts = await loadPosts();
        renderArchive(posts);
    } catch (error) {
        console.error('Failed to load archive:', error);
        showError('archive-container');
    }
}

function renderArchive(posts) {
    const container = document.getElementById('archive-container');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-results">No posts available yet.</div>';
        return;
    }
    
    // Group posts by year
    const postsByYear = {};
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear[year]) {
            postsByYear[year] = [];
        }
        postsByYear[year].push(post);
    });
    
    // Sort years descending
    const years = Object.keys(postsByYear).sort((a, b) => b - a);
    
    container.innerHTML = years.map(year => `
        <h2 class="archive-year">${year}</h2>
        ${postsByYear[year].map(post => `
            <div class="archive-item">
                <time class="post-date">${formatDate(post.date)}</time>
                <h3 class="post-title"><a href="${post.url}">${post.title}</a></h3>
                ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
            </div>
        `).join('')}
    `).join('');
}

// =====================
// GIGS PAGE
// =====================
let allGigs = [];
let allSongs = [];

let currentCalendarDate = new Date();

async function initGigsPage() {
    // Tab switching
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.getAttribute('data-tab');
            const gigsContent = document.getElementById('gigs-content');
            const songsContent = document.getElementById('songs-content');
            
            if (tabType === 'gigs') {
                gigsContent.classList.remove('hidden');
                songsContent.classList.add('hidden');
            } else if (tabType === 'songs') {
                gigsContent.classList.add('hidden');
                songsContent.classList.remove('hidden');
                if (allSongs.length === 0) {
                    loadSongs();
                }
            }
        });
    });
    
    // View toggle (List/Calendar)
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            const listView = document.getElementById('gig-list');
            const calendarView = document.getElementById('calendar-view');
            
            if (view === 'list') {
                listView.classList.remove('hidden');
                calendarView.classList.add('hidden');
            } else if (view === 'calendar') {
                listView.classList.add('hidden');
                calendarView.classList.remove('hidden');
                renderCalendar(currentCalendarDate, allGigs);
            }
        });
    });
    
    // Calendar navigation
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar(currentCalendarDate, allGigs);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar(currentCalendarDate, allGigs);
        });
    }
    
    // Load gigs by default
    try {
        allGigs = await loadGigs();
        renderGigs(allGigs);
    } catch (error) {
        console.error('Failed to load gigs:', error);
        showError('gig-list');
    }
    
    // Setup song search
    const searchInput = document.getElementById('song-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterSongs(e.target.value);
        });
    }
}

function renderGigs(gigs) {
    const container = document.getElementById('gig-list');
    if (!container) return;
    
    if (gigs.length === 0) {
        container.innerHTML = '<div class="no-results">No gigs scheduled yet.</div>';
        return;
    }
    
    // Sort by date (most recent first)
    const sortedGigs = gigs
        .filter(gig => gig.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedGigs.map(gig => `
        <div class="gig-item">
            <div class="gig-artist">${gig.artist || gig.title}</div>
            <div class="gig-venue">${gig.venue}${gig.location ? ', ' + gig.location : ''}</div>
            <div class="gig-date">${formatDate(gig.date)}</div>
        </div>
    `).join('');
}

function renderCalendar(date, gigs) {
    const monthEl = document.getElementById('calendar-month');
    const gridEl = document.getElementById('calendar-grid');
    
    if (!monthEl || !gridEl) return;
    
    // Set month title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthEl.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Get calendar data
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create gigs map by date
    const gigsByDate = {};
    gigs.forEach(gig => {
        if (gig.date) {
            const gigDate = new Date(gig.date);
            const dateKey = `${gigDate.getFullYear()}-${gigDate.getMonth()}-${gigDate.getDate()}`;
            if (!gigsByDate[dateKey]) {
                gigsByDate[dateKey] = [];
            }
            gigsByDate[dateKey].push(gig);
        }
    });
    
    // Build calendar HTML
    let html = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateKey = `${year}-${month}-${day}`;
        const isToday = currentDate.toDateString() === today.toDateString();
        const dayGigs = gigsByDate[dateKey] || [];
        const hasGig = dayGigs.length > 0;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasGig) classes += ' has-gig';
        
        html += `<div class="${classes}">`;
        html += `<div class="calendar-day-number">${day}</div>`;
        
        if (hasGig) {
            dayGigs.slice(0, 2).forEach(gig => {
                html += `<div class="calendar-gig-title">${gig.artist || gig.title}</div>`;
            });
            if (dayGigs.length > 2) {
                html += `<div class="calendar-gig-title">+${dayGigs.length - 2} more</div>`;
            }
        }
        
        html += '</div>';
    }
    
    gridEl.innerHTML = html;
}

async function loadSongs() {
    const container = document.getElementById('songs-table-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading songs...</div>';
    
    try {
        const response = await fetch('/data/songs.csv');
        if (!response.ok) throw new Error('Failed to load songs');
        
        const csvText = await response.text();
        allSongs = parseSongsCsv(csvText);
        renderSongs(allSongs);
        updateSongStats(allSongs);
    } catch (error) {
        console.error('Failed to load songs:', error);
        container.innerHTML = '<div class="error">Failed to load songs. Please try again later.</div>';
    }
}

function parseSongsCsv(csvText) {
    const lines = csvText.trim().split('\n');
    const songs = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by tab (TSV format)
        const parts = line.split('\t');
        if (parts.length >= 2) {
            const songName = parts[0].trim();
            const playCount = parseInt(parts[1]) || 0;
            const details = parts[2] ? parts[2].trim() : '';
            
            songs.push({
                name: songName,
                plays: playCount,
                details: details
            });
        }
    }
    
    // Sort by play count descending
    return songs.sort((a, b) => b.plays - a.plays);
}

function renderSongs(songs) {
    const container = document.getElementById('songs-table-container');
    if (!container) return;
    
    if (songs.length === 0) {
        container.innerHTML = '<div class="no-results">No songs found.</div>';
        return;
    }
    
    const hasDetails = songs.some(song => song.details);
    
    container.innerHTML = `
        <table class="songs-table">
            <thead>
                <tr>
                    ${hasDetails ? '<th></th>' : ''}
                    <th>Song</th>
                    <th>Plays</th>
                </tr>
            </thead>
            <tbody>
                ${songs.map((song, index) => {
                    const hasDetail = song.details && song.details.length > 0;
                    return `
                        <tr>
                            ${hasDetails ? `<td><span class="expand-icon" onclick="toggleSongDetails(${index})">${hasDetail ? '▶' : '•'}</span></td>` : ''}
                            <td>${song.name}</td>
                            <td>${song.plays}</td>
                        </tr>
                        ${hasDetail ? `
                            <tr class="song-details" id="song-details-${index}">
                                <td colspan="${hasDetails ? '3' : '2'}">${song.details}</td>
                            </tr>
                        ` : ''}
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function toggleSongDetails(index) {
    const detailsRow = document.getElementById(`song-details-${index}`);
    if (detailsRow) {
        detailsRow.classList.toggle('visible');
    }
}

function filterSongs(query) {
    if (!query) {
        renderSongs(allSongs);
        return;
    }
    
    const filtered = allSongs.filter(song => 
        song.name.toLowerCase().includes(query.toLowerCase()) ||
        (song.details && song.details.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderSongs(filtered);
    updateSongStats(filtered);
}

function updateSongStats(songs) {
    const totalSongs = songs.length;
    const totalPlays = songs.reduce((sum, song) => sum + song.plays, 0);
    
    const totalSongsEl = document.getElementById('total-songs');
    const totalPlaysEl = document.getElementById('total-plays');
    
    if (totalSongsEl) totalSongsEl.textContent = totalSongs;
    if (totalPlaysEl) totalPlaysEl.textContent = totalPlays;
}

// =====================
// DATA LOADING
// =====================
async function loadPosts() {
    try {
        const response = await fetch('/data/posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        return await response.json();
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

async function loadGigs() {
    try {
        const response = await fetch('/data/gigs.json');
        if (!response.ok) throw new Error('Failed to load gigs');
        return await response.json();
    } catch (error) {
        console.error('Error loading gigs:', error);
        return [];
    }
}

// =====================
// UTILITIES
// =====================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showError(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="error">Failed to load content. Please try again later.</div>';
    }
}

// =====================
// PROJECTS PAGE
// =====================
let allProjects = [];

async function initProjectsPage() {
    // Tab switching
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.getAttribute('data-tab');
            const projectsContent = document.getElementById('projects-content');
            const ideasContent = document.getElementById('ideas-content');
            
            if (tabType === 'projects') {
                projectsContent.classList.remove('hidden');
                ideasContent.classList.add('hidden');
            } else if (tabType === 'ideas') {
                projectsContent.classList.add('hidden');
                ideasContent.classList.remove('hidden');
            }
        });
    });
    
    // Load projects
    try {
        allProjects = await loadProjects();
        renderProjects(allProjects);
        renderIdeas(allProjects);
    } catch (error) {
        console.error('Failed to load projects:', error);
        showError('projects-list');
        showError('ideas-list');
    }
}

async function loadProjects() {
    const response = await fetch('/data/projects.json');
    if (!response.ok) throw new Error('Failed to load projects');
    return await response.json();
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    if (!container) return;
    
    // Filter for projects (not ideas)
    const projectItems = projects.filter(p => 
        p.status === 'Live' || p.status === 'In Progress' || p.status === 'In Progres'
    );
    
    if (projectItems.length === 0) {
        container.innerHTML = '<div class="no-results">No projects yet. Check back soon!</div>';
        return;
    }
    
    container.innerHTML = projectItems.map(project => {
        const statusClass = project.status.toLowerCase().replace(' ', '-');
        return `
            <div class="project-card">
                <div class="project-header">
                    <div>
                        <h2 class="project-title">${project.name}</h2>
                    </div>
                    <span class="project-status ${statusClass}">${project.status}</span>
                </div>
                <div class="project-divider"></div>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    ${project.link ? `<a href="${project.link}" class="project-link" target="_blank" rel="noopener">View Project →</a>` : '<span></span>'}
                    ${project.date ? `<span class="project-date">${new Date(project.date).getFullYear()}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderIdeas(projects) {
    const container = document.getElementById('ideas-list');
    if (!container) return;
    
    // Filter for ideas only
    const ideaItems = projects.filter(p => p.status === 'Idea');
    
    if (ideaItems.length === 0) {
        container.innerHTML = '<div class="no-results">No ideas yet. Check back soon!</div>';
        return;
    }
    
    container.innerHTML = ideaItems.map(idea => `
        <div class="idea-item">
            <h3 class="idea-title">${idea.name}</h3>
            <p class="idea-description">${idea.description}</p>
        </div>
    `).join('');
}

// Make functions available globally
window.toggleSongDetails = toggleSongDetails;
window.renderCalendar = renderCalendar;
