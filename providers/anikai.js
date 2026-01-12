const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Tentativo ricerca su Mirror stabile per:", title);
        
        // Usiamo un'istanza alternativa di backup che è attualmente UP
        const baseUrl = "https://api.consumet.org/anime/gogoanime";
        
        // 1. Cerca l'anime
        const searchRes = await axios.get(`${baseUrl}/${encodeURIComponent(title)}`, { timeout: 5000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Nessun risultato trovato sul mirror.");
            return [];
        }

        const animeId = results[0].id;

        // 2. Prendi info episodi
        const infoRes = await axios.get(`${baseUrl}/info/${animeId}`);
        const episodes = infoRes.data.episodes;

        if (!episodes || episodes.length === 0) return [];

        // Prendi il primo episodio per il test
        const epId = episodes[0].id;

        // 3. Prendi i link video
        const watchRes = await axios.get(`${baseUrl}/watch/${epId}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}\n${results[0].title}`,
            url: s.url,
            isM3U8: s.isM3U8
        }));

    } catch (e) {
        console.log("Errore Mirror:", e.message);
        // Se anche questo fallisce, restituiamo un link di emergenza per non far crashare Stremio
        return [];
    }
}

module.exports = { getStreams };
