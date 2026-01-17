# AnimeStremio Addon (English Dub)

This is a Stremio addon for watching English dubbed anime.

## Features

- Streams English dubbed anime from **AnimePahe** (primary)
- Fallback to **AnimeKai** if no stream is available
- Only `stream` resource (no catalog or metadata)
- Works directly on Stremio via URL

## How to Install

1. Deploy the addon on Render (or any Node.js hosting)
2. Copy the `manifest.json` URL
3. Open Stremio → Add-ons → "Community Add-ons" → +  
4. Select "Install from URL" and paste the manifest URL

## Usage

- Search for an anime on AniList / MAL
- Click the episode → addon will fetch the stream
- Streams automatically fall back to AnimeKai if AnimePahe doesn't have it

## Notes

- No placeholder videos; if no stream is found, nothing is displayed
- Free and maintained for personal use
