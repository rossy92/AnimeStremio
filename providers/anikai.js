const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Universal] Ricerca Anikai per: ${title}`);
        
        // Usiamo un'istanza "mirror" che solitamente non banna gli IP cloud
        // Questa istanza fa da proxy naturale.
        const apiBase = "https://consumet-api-five.vercel.app/anime/gogoanime";
        
        // 1. Ricerca
        const searchRes = await axios.get(`${apiBase}/${encodeURIComponent(title)}`, { timeout: 10000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Nessun risultato. Provo con ricerca grezza...");
            return [];
        }

        const animeId = results[0].id;
        console.log(`Anime trovato: ${animeId}`);

        // 2. Recupero Episodi
        const infoRes = await axios.get(`${apiBase}/info/${animeId}`);
        const episodes = infoRes.data.episodes;
        if (!episodes || episodes.length === 0) return [];

        const lastEp = episodes[episodes.length - 1].id;

        // 3. Estrazione Link Video con Proxy Headers integrati
        const watchRes = await axios.get(`${apiBase}/watch/${lastEp.id}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `${s.quality} - Mirror Stabile\n${results[0].title}`,
            url: s.url,
            isM3U8: s.url.includes(".m3u8"),
            behaviorHints: {
                notWebReady: false,
                // Questo è il "trucco" del proxy: diciamo al video di passare con queste credenziali
                proxyHeaders: {
                    "Referer": "https://gogoanime.bid/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
            }
        }));

    } catch (e) {
        console.log("Errore sistema universale:", e.message);
        return [];
    }
}

module.exports = { getStreams };
