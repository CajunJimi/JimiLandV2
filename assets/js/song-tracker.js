/**
 * Song Tracker Module
 * Handles Google Sheets integration for song tracking functionality
 */

class SongTracker {
    constructor() {
        this.songs = [];
        this.filteredSongs = [];
        this.isLoading = false;
        
        // Song data configuration
        this.sheetConfig = {
            // Local CSV file URL (much more reliable than Google Sheets API)
            csvUrl: '/data/songs.csv',
            columns: {
                song: 0,      // Column A: Song name
                plays: 1,     // Column B: Number of plays
                when: 2,      // Column C: When heard
                who: 3,       // Column D: Who with
                where: 4      // Column E: Where heard
            }
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.container = document.getElementById('song-tracker-container');
        this.searchInput = document.getElementById('song-search');
        this.refreshBtn = document.getElementById('refresh-songs');
        this.songsTable = document.getElementById('songs-table');
        this.songsTableBody = document.getElementById('songs-tbody');
        this.loadingDiv = document.getElementById('loading-songs');
        this.noSongsDiv = document.getElementById('no-songs');
        this.totalSongsSpan = document.getElementById('total-songs');
        this.totalPlaysSpan = document.getElementById('total-plays');
    }
    
    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterSongs(e.target.value);
            });
        }
        
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                this.loadSongs();
            });
        }
    }
    
    /**
     * Set the Google Sheets CSV URL
     * @param {string} csvUrl - The CSV export URL from Google Sheets
     */
    setCsvUrl(csvUrl) {
        this.sheetConfig.csvUrl = csvUrl;
    }
    
    /**
     * Load songs from local CSV file
     */
    async loadSongs() {
        if (!this.sheetConfig.csvUrl) {
            console.error('CSV URL not configured');
            this.showError('CSV file not configured. Please check your setup.');
            return;
        }
        
        this.setLoading(true);
        
        try {
            console.log('Loading songs from local CSV:', this.sheetConfig.csvUrl);
            
            const response = await fetch(this.sheetConfig.csvUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to load CSV file: ${response.status} - ${response.statusText}`);
            }
            
            const csvData = await response.text();
            console.log('CSV data loaded successfully, length:', csvData.length);
            console.log('First 200 chars:', csvData.substring(0, 200));
            
            this.parseCsvData(csvData);
            this.updateDisplay();
            
        } catch (error) {
            console.error('Error loading songs:', error);
            this.showError('Failed to load song data. Please make sure the CSV file exists and is accessible.');
        } finally {
            this.setLoading(false);
        }
    }
    
    /**
     * Parse CSV data into song objects
     * @param {string} csvData - Raw CSV data
     */
    parseCsvData(csvData) {
        console.log('Parsing CSV data...');
        const lines = csvData.trim().split('\n');
        const songs = [];
        
        console.log('Total lines in CSV:', lines.length);
        console.log('First few lines:', lines.slice(0, 3));
        
        // Skip header row if it exists
        const startIndex = lines[0].toLowerCase().includes('song') ? 1 : 0;
        console.log('Starting from line index:', startIndex);
        
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV considering quoted values
            const columns = this.parseCSVLine(line);
            console.log(`Line ${i}:`, columns);
            
            if (columns.length >= 5) {
                const song = {
                    name: columns[this.sheetConfig.columns.song] || 'Unknown',
                    plays: parseInt(columns[this.sheetConfig.columns.plays]) || 0,
                    when: columns[this.sheetConfig.columns.when] || 'Unknown',
                    who: columns[this.sheetConfig.columns.who] || 'Unknown',
                    where: columns[this.sheetConfig.columns.where] || 'Unknown'
                };
                
                console.log('Parsed song:', song);
                songs.push(song);
            } else {
                console.log(`Line ${i} skipped - insufficient columns:`, columns.length);
            }
        }
        
        console.log('Total songs parsed:', songs.length);
        this.songs = songs;
        this.filteredSongs = [...songs];
    }
    
    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line to parse
     * @returns {Array} Array of column values
     */
    parseCSVLine(line) {
        const columns = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] === ',')) {
                inQuotes = true;
            } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                columns.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        columns.push(current.trim());
        return columns;
    }
    
    /**
     * Filter songs based on search term
     * @param {string} searchTerm - Search term to filter by
     */
    filterSongs(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredSongs = [...this.songs];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredSongs = this.songs.filter(song => 
                song.name.toLowerCase().includes(term) ||
                song.who.toLowerCase().includes(term) ||
                song.where.toLowerCase().includes(term) ||
                song.when.toLowerCase().includes(term)
            );
        }
        
        this.renderSongsTable();
    }
    
    /**
     * Update the display with loaded songs
     */
    updateDisplay() {
        this.updateStats();
        this.renderSongsTable();
        
        if (this.songs.length === 0) {
            this.showNoSongs();
        } else {
            this.hideNoSongs();
        }
    }
    
    /**
     * Update statistics display
     */
    updateStats() {
        const totalSongs = this.songs.length;
        const totalPlays = this.songs.reduce((sum, song) => sum + song.plays, 0);
        
        if (this.totalSongsSpan) {
            this.totalSongsSpan.textContent = totalSongs;
        }
        
        if (this.totalPlaysSpan) {
            this.totalPlaysSpan.textContent = totalPlays;
        }
    }
    
    /**
     * Render the songs table
     */
    renderSongsTable() {
        if (!this.songsTableBody) return;
        
        this.songsTableBody.innerHTML = '';
        
        // Sort songs by play count (descending) then by name
        const sortedSongs = this.filteredSongs.sort((a, b) => {
            if (b.plays !== a.plays) {
                return b.plays - a.plays;
            }
            return a.name.localeCompare(b.name);
        });
        
        sortedSongs.forEach(song => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="song-name">${this.escapeHtml(song.name)}</td>
                <td class="song-plays">${song.plays}</td>
                <td class="song-when">${this.escapeHtml(song.when)}</td>
                <td class="song-who">${this.escapeHtml(song.who)}</td>
                <td class="song-where">${this.escapeHtml(song.where)}</td>
            `;
            this.songsTableBody.appendChild(row);
        });
    }
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Set loading state
     * @param {boolean} loading - Whether loading or not
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        if (this.loadingDiv) {
            this.loadingDiv.classList.toggle('hidden', !loading);
        }
        
        if (this.refreshBtn) {
            this.refreshBtn.disabled = loading;
            this.refreshBtn.textContent = loading ? '⏳ Loading...' : '🔄 Refresh';
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (this.noSongsDiv) {
            this.noSongsDiv.classList.remove('hidden');
            this.noSongsDiv.innerHTML = `
                <h3>Error Loading Songs</h3>
                <p>${message}</p>
            `;
        }
    }
    
    /**
     * Show no songs message
     */
    showNoSongs() {
        if (this.noSongsDiv) {
            this.noSongsDiv.classList.remove('hidden');
        }
    }
    
    /**
     * Hide no songs message
     */
    hideNoSongs() {
        if (this.noSongsDiv) {
            this.noSongsDiv.classList.add('hidden');
        }
    }
    
    /**
     * Show the song tracker container
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }
    
    /**
     * Hide the song tracker container
     */
    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }
}

// Initialize song tracker when DOM is loaded
let songTracker;

document.addEventListener('DOMContentLoaded', () => {
    songTracker = new SongTracker();
    
    // Expose the instance to global scope for gigs-loader integration
    window.songTracker = songTracker;
});

// Export for use in other modules
window.SongTracker = SongTracker;
