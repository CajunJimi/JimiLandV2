// Concert Map Functionality

let concertMap = null;
let markerClusterGroup = null;
const geocodeCache = {};

// Initialize the concert map
async function initMap() {
    if (!document.getElementById('concert-map')) return;
    
    // Initialize map centered on UK (adjust based on your concert locations)
    concertMap = L.map('concert-map').setView([54.5, -4.0], 6);
    
    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(concertMap);
    
    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    
    concertMap.addLayer(markerClusterGroup);
    
    // Load and display gigs on map
    await loadGigsOnMap();
}

// Load gigs and add to map
async function loadGigsOnMap() {
    try {
        const response = await fetch('/data/gigs.json');
        const gigs = await response.json();
        
        // Filter out gigs without location
        const gigsWithLocation = gigs.filter(g => g.location || g.venue);
        
        // Group gigs by venue+location
        const venueGroups = groupGigsByVenue(gigsWithLocation);
        
        // Geocode and add markers
        await addVenueMarkers(venueGroups);
        
        // Update stats
        updateMapStats(gigsWithLocation, venueGroups);
    } catch (error) {
        console.error('Failed to load gigs for map:', error);
    }
}

// Group gigs by venue and location
function groupGigsByVenue(gigs) {
    const groups = {};
    
    gigs.forEach(gig => {
        // Create unique key for venue+location
        const venue = gig.venue || '';
        const location = gig.location || '';
        const key = `${venue}|${location}`;
        
        if (!groups[key]) {
            groups[key] = {
                venue: venue,
                location: location,
                gigs: []
            };
        }
        
        groups[key].gigs.push(gig);
    });
    
    return Object.values(groups);
}

// Add markers for each venue
async function addVenueMarkers(venueGroups) {
    for (const group of venueGroups) {
        // Try to geocode venue + location first, fallback to just location
        let coords = null;
        
        if (group.venue && group.location) {
            coords = await geocodeLocation(`${group.venue}, ${group.location}`);
        }
        
        if (!coords && group.location) {
            coords = await geocodeLocation(group.location);
        }
        
        if (coords) {
            addMarker(coords, group);
        }
    }
    
    // Fit map to show all markers
    if (markerClusterGroup.getLayers().length > 0) {
        concertMap.fitBounds(markerClusterGroup.getBounds().pad(0.1));
    }
}

// Add a single marker to the map
function addMarker(coords, venueGroup) {
    const marker = L.marker([coords.lat, coords.lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: '<div class="custom-marker-icon"></div>',
            iconSize: [14, 14]
        })
    });
    
    // Create popup content
    const popupContent = createPopupContent(venueGroup);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'concert-popup'
    });
    
    markerClusterGroup.addLayer(marker);
}

// Create popup HTML content
function createPopupContent(venueGroup) {
    const { venue, location, gigs } = venueGroup;
    
    // Sort gigs by date (most recent first)
    const sortedGigs = gigs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '<div class="map-popup">';
    
    // Venue name (if exists)
    if (venue) {
        html += `<h3>${venue}</h3>`;
    } else {
        html += `<h3>${location}</h3>`;
    }
    
    // Location (if venue exists)
    if (venue && location) {
        html += `<div class="location">${location}</div>`;
    }
    
    // Concert list
    html += '<ul class="concert-list">';
    sortedGigs.forEach(gig => {
        html += `
            <li class="concert-item">
                <div class="artist">${gig.artist || gig.title}</div>
                <div class="date">${formatDate(gig.date)}</div>
            </li>
        `;
    });
    html += '</ul>';
    
    html += '</div>';
    return html;
}

// Geocode a location using Nominatim (OpenStreetMap)
async function geocodeLocation(location) {
    // Check cache first
    if (geocodeCache[location]) {
        return geocodeCache[location];
    }
    
    try {
        // Add delay to respect rate limits (1 request per second)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'JimiLand Concert Map (https://jimi.land)'
                }
            }
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const coords = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
            geocodeCache[location] = coords;
            return coords;
        }
    } catch (error) {
        console.error(`Failed to geocode ${location}:`, error);
    }
    
    return null;
}

// Update map statistics
function updateMapStats(gigs, venueGroups) {
    // Total venues
    const totalVenues = venueGroups.length;
    document.getElementById('total-venues').textContent = totalVenues;
    
    // Total cities (unique locations)
    const cities = new Set(gigs.filter(g => g.location).map(g => g.location));
    document.getElementById('total-cities').textContent = cities.size;
    
    // Total concerts
    document.getElementById('map-concerts').textContent = gigs.length;
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}
