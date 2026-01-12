const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Tentativo con Mirror C per:", title);
        
        // Nuova istanza meno congestionata
        const apiBase = "https://api-consumet-org-five.vercel.app/anime/gogoanime";
        
        // 1. Cerca l'anime
        const searchRes = await axios.get(`${apiBase}/${encodeURIComponent(title)}`, { timeout: 10000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Nessun risultato su Mirror C.");
            return [];
        }

        const animeId = results[0].id;
        console.log("Anime trovato ID:", animeId);

        // 2. Prendi gli episodi
        const infoRes = await axios.get(`${apiBase}/info/${animeId}`);
        const episodes = infoRes.data.episodes;

        if (!episodes || episodes.length === 0) return [];

        // Prendi l'ultimo episodio
        const epId = episodes[episodes.length - 1].id;

        // 3. Prendi i link video
        const watchRes = await axios.get(`${apiBase}/watch/${epId}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}\n${results[0].title}`,
            url: s.url,
            isM3U8: s.url.includes(".m3u8")
        }));

    } catch (e) {
        console.log("Errore Mirror C:", e.message);
        return [];
    }
}

module.exports = { getStreams };
