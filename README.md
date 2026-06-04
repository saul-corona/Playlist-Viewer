# Playlist Viewer

A lightweight local web app to browse and play YouTube playlists from exported JSON files. Videos are displayed as thumbnail grids; clicking any thumbnail plays it inline via the YouTube embed player.

## Motivation

This project started as a way to migrate saved playlists to a new YouTube account before deleting the old one entirely. Beyond the migration, it became a deliberate choice to step away from the recommendation algorithm — watching only content I already curated rather than falling into rabbit holes and spending hours on videos that felt important in the moment but rarely were. The result is a simple viewer for the music playlists of bands I actually enjoy listening to, nothing more.

<img width="1492" height="939" alt="Screenshot 2026-06-03 at 9 04 13 p m" src="https://github.com/user-attachments/assets/4d585b19-a152-41f5-9da0-611f4350b24c" />


## Features

- Sidebar listing all loaded playlists
- Thumbnail grid with lazy loading
- Inline YouTube playback on click
- Private videos are automatically filtered out
- Multiple playlists supported — just drop more JSON files in the directory

## Requirements

- [Node.js](https://nodejs.org) (no dependencies, uses only built-in modules)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — to export playlists from YouTube
- [jq](https://stedolan.github.io/jq/) — to process the exported data

## Getting a playlist

**1. Export the playlist metadata with yt-dlp:**

```bash
yt-dlp --flat-playlist -j "https://youtube.com/playlist?list=YOUR_PLAYLIST_ID" \
  | jq '.id, .title' > playlist.txt
```

**2. Convert the text file to JSON:**

```bash
./playlist_json.sh playlist.txt
```

This generates `videos.json` in the current directory. Rename it to anything meaningful (e.g. `my-playlist.json`) — the filename becomes the playlist's display name in the sidebar.

Repeat for as many playlists as you want. All `.json` files in the project directory are loaded automatically.

## Running the app

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
