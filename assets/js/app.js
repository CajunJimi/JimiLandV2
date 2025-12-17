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

// Make toggleSongDetails available globally
window.toggleSongDetails = toggleSongDetails;
