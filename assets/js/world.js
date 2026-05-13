/**
 * World map page.
 *
 * Reads data/places.json (Notion Places DB) and data/gigs.json (geocoded
 * gig venues), pins everything on a MapLibre GL map with theme-aware
 * CARTO vector basemap. Filter chips by category + trip dropdown. Side
 * panel slides in on pin click with photos/body/links.
 */

(function () {
    if (!document.getElementById('world-map')) return;

    // ─────────────────────────────────────────────────────────────
    // Basemap (themed CARTO vector styles)
    // ─────────────────────────────────────────────────────────────

    const STYLE_URLS = {
        light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        dark:  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    };

    function currentTheme() {
        return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    }

    // ─────────────────────────────────────────────────────────────
    // Category metadata
    // ─────────────────────────────────────────────────────────────

    // Maps Notion category strings to a normalized internal key + label.
    // Add new categories here when you add them to the Notion Select.
    const CATEGORY_META = {
        venue:      { label: 'Venues',       cssKey: 'venue' },
        museum:     { label: 'Museums',      cssKey: 'museum' },
        camping:    { label: 'Camping',      cssKey: 'camping' },
        walk:       { label: 'Walks',        cssKey: 'walk' },
        shop:       { label: 'Shops',        cssKey: 'shop' },
        restaurant: { label: 'Restaurants',  cssKey: 'restaurant' },
        conference: { label: 'Conferences', cssKey: 'conference' },
        confrence:  { label: 'Conferences', cssKey: 'conference' }, // tolerate Notion typo
        gig:        { label: 'Concerts',     cssKey: 'gig' },
        other:      { label: 'Other',        cssKey: 'other' },
    };

    function categoryKey(raw) {
        const k = (raw || 'other').toLowerCase().trim();
        return CATEGORY_META[k] ? k : 'other';
    }

    // ─────────────────────────────────────────────────────────────
    // Data loading
    // ─────────────────────────────────────────────────────────────

    async function fetchJSON(url) {
        try {
            const r = await fetch(url, { cache: 'no-cache' });
            if (!r.ok) return [];
            return await r.json();
        } catch (e) {
            console.warn('Failed to load', url, e);
            return [];
        }
    }

    function toFeatureFromPlace(p) {
        if (p.lat == null || p.lng == null) return null;
        return {
            type: 'place',
            id: p.id,
            title: p.title,
            location: p.location,
            lat: p.lat,
            lng: p.lng,
            categoryRaw: p.category || 'Other',
            category: categoryKey(p.category),
            trip: p.trip || null,
            dateStart: p.date_start || null,
            dateEnd: p.date_end || null,
            photos: p.photos || [],
            bodyHtml: p.body_html || '',
            linkedPostUrls: p.linked_post_urls || [],
        };
    }

    function toFeatureFromGig(g) {
        if (g.lat == null || g.lng == null) return null;
        const dateStr = g.date || null;
        const venueLabel = g.venue || g.location || '';
        return {
            type: 'gig',
            id: g.id,
            title: g.artist || g.title || 'Untitled gig',
            location: venueLabel + (g.location && g.location !== venueLabel ? `, ${g.location}` : ''),
            lat: g.lat,
            lng: g.lng,
            categoryRaw: 'Gig',
            category: 'gig',
            trip: null,
            dateStart: dateStr,
            dateEnd: null,
            photos: [],
            bodyHtml: '',
            linkedPostUrls: [],
            venue: g.venue,
            gigDate: dateStr,
        };
    }

    // ─────────────────────────────────────────────────────────────
    // Filter state (with URL sync)
    // ─────────────────────────────────────────────────────────────

    const state = {
        activeCategories: new Set(), // empty = all
        activeTrip: null,            // null = all
    };

    function readURLState() {
        const sp = new URLSearchParams(location.search);
        const cats = sp.get('cat');
        if (cats) state.activeCategories = new Set(cats.split(',').filter(Boolean));
        const trip = sp.get('trip');
        if (trip) state.activeTrip = trip;
    }

    function writeURLState() {
        const sp = new URLSearchParams();
        if (state.activeCategories.size > 0) {
            sp.set('cat', Array.from(state.activeCategories).join(','));
        }
        if (state.activeTrip) sp.set('trip', state.activeTrip);
        const qs = sp.toString();
        const url = qs ? `${location.pathname}?${qs}` : location.pathname;
        history.replaceState(null, '', url);
    }

    function matchesFilter(f) {
        if (state.activeCategories.size > 0 && !state.activeCategories.has(f.category)) return false;
        if (state.activeTrip && f.trip !== state.activeTrip) return false;
        return true;
    }

    // ─────────────────────────────────────────────────────────────
    // Render: toolbar
    // ─────────────────────────────────────────────────────────────

    function renderToolbar(features) {
        const filtersEl = document.getElementById('world-filters');
        const statEl = document.getElementById('world-stat');
        filtersEl.innerHTML = '';

        // Per-category chip with count
        const counts = {};
        const trips = new Set();
        for (const f of features) {
            counts[f.category] = (counts[f.category] || 0) + 1;
            if (f.trip) trips.add(f.trip);
        }

        // Sort categories: by count desc, "other" last
        const cats = Object.keys(counts).sort((a, b) => {
            if (a === 'other') return 1;
            if (b === 'other') return -1;
            return counts[b] - counts[a];
        });

        for (const cat of cats) {
            const meta = CATEGORY_META[cat] || CATEGORY_META.other;
            const chip = document.createElement('button');
            chip.className = 'world-chip' + (state.activeCategories.has(cat) ? ' active' : '');
            chip.type = 'button';
            chip.innerHTML = `
                <span class="dot" style="background-color: var(--pin-${meta.cssKey});"></span>
                <span>${meta.label}</span>
                <span class="count">${counts[cat]}</span>
            `;
            chip.addEventListener('click', () => {
                if (state.activeCategories.has(cat)) state.activeCategories.delete(cat);
                else state.activeCategories.add(cat);
                writeURLState();
                applyFilter();
            });
            filtersEl.appendChild(chip);
        }

        // Trip dropdown (if any trips exist)
        if (trips.size > 0) {
            const divider = document.createElement('span');
            divider.className = 'world-chip-divider';
            filtersEl.appendChild(divider);

            const sel = document.createElement('select');
            sel.className = 'world-trip-select';
            sel.setAttribute('aria-label', 'Filter by trip');
            const sorted = Array.from(trips).sort();
            sel.innerHTML = `<option value="">All trips</option>` +
                sorted.map(t => `<option value="${escapeAttr(t)}"${state.activeTrip === t ? ' selected' : ''}>${escapeHtml(t)}</option>`).join('');
            sel.addEventListener('change', () => {
                state.activeTrip = sel.value || null;
                writeURLState();
                applyFilter();
            });
            filtersEl.appendChild(sel);
        }

        statEl.textContent = `${features.length} place${features.length === 1 ? '' : 's'}`;
    }

    // ─────────────────────────────────────────────────────────────
    // Render: pins on map
    // ─────────────────────────────────────────────────────────────

    let map = null;
    const markers = []; // { feature, marker, el }

    function clearMarkers() {
        for (const m of markers) m.marker.remove();
        markers.length = 0;
    }

    function isPanelOpen() {
        const p = document.getElementById('world-panel');
        return p && p.getAttribute('aria-hidden') === 'false';
    }

    // Map padding: leaves room on the right for the panel when open.
    function mapPadding() {
        const panelOpen = isPanelOpen();
        const wide = window.innerWidth > 768;
        return {
            top: 80,
            right: panelOpen && wide ? 420 : 80,
            bottom: 80,
            left: 80,
        };
    }

    function renderMarkers(features) {
        clearMarkers();
        const visible = features.filter(matchesFilter);

        document.getElementById('world-empty').classList.toggle('hidden', visible.length > 0);

        for (const f of visible) {
            const el = document.createElement('div');
            el.className = `world-marker cat-${(CATEGORY_META[f.category] || CATEGORY_META.other).cssKey}`;
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', f.title);
            el.tabIndex = 0;

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([f.lng, f.lat])
                .addTo(map);

            const open = () => {
                document.querySelectorAll('.world-marker.active').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                openPanel(f);
                // Fly to the pin, with the right offset so it sits in the
                // visible (non-panel-covered) area on desktop.
                const wide = window.innerWidth > 768;
                map.flyTo({
                    center: [f.lng, f.lat],
                    zoom: Math.max(map.getZoom(), 8),
                    offset: wide ? [-190, 0] : [0, -120],
                    duration: 700,
                    essential: true,
                });
            };
            el.addEventListener('click', open);
            el.addEventListener('keypress', (e) => { if (e.key === 'Enter') open(); });

            markers.push({ feature: f, marker, el });
        }

        // Fit map to visible markers (if any). Lower maxZoom keeps single-
        // point or tightly-clustered filters from zooming to street level.
        if (visible.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            for (const f of visible) bounds.extend([f.lng, f.lat]);
            try {
                map.fitBounds(bounds, {
                    padding: mapPadding(),
                    maxZoom: 6,
                    duration: 600,
                });
            } catch (_) { /* single-point bounds throws — ignore */ }
        }
    }

    function applyFilter() {
        renderToolbar(allFeatures);
        renderMarkers(allFeatures);
    }

    // ─────────────────────────────────────────────────────────────
    // Side panel
    // ─────────────────────────────────────────────────────────────

    function openPanel(f) {
        const inner = document.getElementById('world-panel-inner');
        const panel = document.getElementById('world-panel');

        const meta = CATEGORY_META[f.category] || CATEGORY_META.other;
        const dateLine = formatDateRange(f.dateStart, f.dateEnd);
        const tripLine = f.trip ? `<span class="trip-tag">${escapeHtml(f.trip)}</span>` : '';

        let photosHtml = '';
        if (f.photos && f.photos.length) {
            photosHtml = `<div class="place-photos">${
                f.photos.map(url => `<img src="${escapeAttr(url)}" loading="lazy" alt="">`).join('')
            }</div>`;
        }

        let linksHtml = '';
        const links = [];
        if (f.linkedPostUrls && f.linkedPostUrls.length) {
            for (const url of f.linkedPostUrls) {
                links.push(`<a class="place-link" href="${escapeAttr(url)}">Read post →</a>`);
            }
        }
        if (links.length) linksHtml = `<div class="place-links">${links.join('')}</div>`;

        inner.innerHTML = `
            <div class="place-category">
                <span class="dot" style="background-color: var(--pin-${meta.cssKey});"></span>
                ${meta.label.replace(/s$/, '')}
            </div>
            <h1 class="place-title">${escapeHtml(f.title)}</h1>
            <div class="place-meta">
                ${dateLine ? `<span>${dateLine}</span>` : ''}
                ${tripLine}
            </div>
            ${f.location ? `<div class="place-location">${escapeHtml(f.location)}</div>` : ''}
            ${photosHtml}
            ${f.bodyHtml ? `<div class="place-body">${f.bodyHtml}</div>` : ''}
            ${linksHtml}
        `;
        panel.setAttribute('aria-hidden', 'false');
    }

    function closePanel() {
        document.getElementById('world-panel').setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.world-marker.active').forEach(e => e.classList.remove('active'));
    }

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────

    function formatDateRange(start, end) {
        if (!start) return '';
        const s = new Date(start);
        const opts = { year: 'numeric', month: 'short', day: 'numeric' };
        const sStr = s.toLocaleDateString('en-GB', opts);
        if (!end || end === start) return sStr;
        const e = new Date(end);
        if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
            // Same month: shorten "10 Aug 2023 – 13 Aug 2023" → "10–13 Aug 2023"
            const day1 = s.toLocaleDateString('en-GB', { day: 'numeric' });
            const tail = e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            return `${day1}–${tail}`;
        }
        return `${sStr} → ${e.toLocaleDateString('en-GB', opts)}`;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        }[c]));
    }
    function escapeAttr(s) { return escapeHtml(s); }

    // ─────────────────────────────────────────────────────────────
    // Init
    // ─────────────────────────────────────────────────────────────

    let allFeatures = [];

    async function init() {
        readURLState();

        // Initialise map
        map = new maplibregl.Map({
            container: 'world-map',
            style: STYLE_URLS[currentTheme()],
            center: [0, 30],
            zoom: 1.5,
            attributionControl: { compact: true },
            cooperativeGestures: false,
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        // Re-tile on theme change
        window.addEventListener('themechange', (e) => {
            const t = (e.detail && e.detail.theme) || currentTheme();
            if (map && STYLE_URLS[t]) map.setStyle(STYLE_URLS[t]);
        });

        // Wire up panel close
        document.getElementById('world-panel-close').addEventListener('click', closePanel);

        // Close panel on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePanel();
        });

        // Wait for the map to be ready before fitBounds works
        await new Promise((resolve) => map.once('load', resolve));

        // Load data in parallel
        const [places, gigs] = await Promise.all([
            fetchJSON('/data/places.json'),
            fetchJSON('/data/gigs.json'),
        ]);

        const placeFeatures = places.map(toFeatureFromPlace).filter(Boolean);
        const gigFeatures = gigs.map(toFeatureFromGig).filter(Boolean);
        allFeatures = [...placeFeatures, ...gigFeatures];

        applyFilter();
    }

    init().catch((err) => {
        console.error('World map init failed:', err);
        const statEl = document.getElementById('world-stat');
        if (statEl) statEl.textContent = 'Failed to load';
    });
})();
