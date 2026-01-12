const axios = require("axios");

async function getStreams(title) {
    try {
        // Usiamo un'istanza alternativa di Consumet più stabile
        const instance = "https://api-consumet-org-three.vercel.app"; 
        
        // 1. Ricerca dell'anime
        const searchRes = await axios.get(`${instance}/anime/gogoanime/${encodeURIComponent(title)}`, { timeout: 4000 });
        const anime = searchRes.data.results[0];

        if (!anime) throw new Error("Anime non trovato");

        // 2. Recupero link episodio 1 (per test)
        const watchRes = await axios.get(`${instance}/anime/gogoanime/watch/${anime.id}-episode-1`);
        
        if (!watchRes.data.sources) throw new Error("Nessuna sorgente");

        return watchRes.data.sources.map(source => ({
            name: "Anikai ENG ⚡",
            title: `DIRECT: ${title}\nQuality: ${source.quality}`,
            url: source.url,
            behaviorHints: {
                notInterchangeable: true,
                proxyHeaders: {
                    "Referer": "https://gogoanime3.co/",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        }));

    } catch (e) {
        console.log("Errore:", e.message);
        // Se tutto fallisce, torniamo al caro vecchio link esterno che non tradisce mai
        return [{
            name: "Anikai ENG 🇬🇧",
            title: `Search on HiAnime (Direct Play Busy)`,
            externalUrl: `https://hianime.to/search?keyword=${encodeURIComponent(title)}`
        }];
    }
}

module.exports = { getStreams };
