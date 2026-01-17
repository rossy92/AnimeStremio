# 🎬 PaheKai Addon (English Dub)

A Stremio addon to watch **English dubbed anime** with ease.  

---

## ⚡ Features

- 🎥 Streams English dubbed anime from **AnimePahe** (primary)
- 🔄 Fallback to **AnimeKai** if no stream is available
- 🧩 Only `stream` resource (no catalog or metadata)
- 🌐 Works directly on Stremio via URL

---

## 🛠 How to Install

1. Deploy the addon on **Render** (or any Node.js hosting)
2. Copy the `manifest.json` URL
3. Open **Stremio → Add-ons → "Community Add-ons" → +**  
4. Select **Install from URL** and paste the manifest URL

---

## 🎮 Usage

- Search for an anime on AniList / MAL
- Click the episode → addon fetches the stream
- Streams automatically fall back to AnimeKai if AnimePahe doesn't have it

---

## 📌 Notes

- No placeholder videos; if no stream is found, nothing is displayed
- Free and maintained for personal use
- Branch `clean-addon` contains the stable, minimal version
