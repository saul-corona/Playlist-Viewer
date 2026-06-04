const playlists = [];
        let activeIndex = -1;

        async function init() {
            try {
                const res = await fetch('/api/playlists');
                const list = await res.json();
                await Promise.all(list.map(loadPlaylist));
                renderSidebar();
                if (playlists.length > 0) selectPlaylist(0);
                else showEmpty('No JSON playlists found in the directory.');
            } catch {
                showEmpty('Could not connect to server. Run: node server.js');
            }
        }

        async function loadPlaylist({ name, file }) {
            try {
                const res = await fetch(`/${encodeURIComponent(file)}`);
                const videos = await res.json();
                if (Array.isArray(videos) && videos.length > 0) {
                    playlists.push({ name, videos });
                }
            } catch {}
        }

        function renderSidebar() {
            document.getElementById('playlist-list').innerHTML = playlists.map((p, i) => `
                <div class="playlist-item ${i === activeIndex ? 'active' : ''}" onclick="selectPlaylist(${i})">
                    <div class="playlist-name">${esc(p.name)}</div>
                    <div class="playlist-count">${p.videos.filter(v => !isPrivate(v)).length} videos</div>
                </div>
            `).join('');
        }

        function selectPlaylist(index) {
            activeIndex = index;
            renderSidebar();
            renderContent();
        }

        function isPrivate(v) {
            return v.title === '[Private video]';
        }

        function renderContent() {
            const playlist = playlists[activeIndex];
            if (!playlist) return;

            const visible = playlist.videos.filter(v => !isPrivate(v));
            const cards = visible.map(v => {
                const id = esc(v.id);
                const title = esc(v.title || '');
                const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                return `
                    <div class="video-card">
                        <div class="video-thumb" onclick="playVideo(this, '${id}')">
                            <img src="${thumb}" alt="${title}" loading="lazy"
                                onerror="this.style.opacity='0.2'">
                            <div class="play-overlay">
                                <div class="play-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        ${v.title ? `<div class="video-label">${title}</div>` : ''}
                    </div>
                `;
            }).join('');

            document.getElementById('content').innerHTML = `
                <div class="content-title">${esc(playlist.name)}</div>
                <div class="content-meta">${visible.length} videos</div>
                <div class="video-grid">${cards}</div>
            `;
        }

        function playVideo(thumbEl, videoId) {
            thumbEl.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                ></iframe>
            `;
        }

        function showEmpty(msg) {
            document.getElementById('content').innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <p>${esc(msg)}</p>
                </div>
            `;
        }

        function esc(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        init();