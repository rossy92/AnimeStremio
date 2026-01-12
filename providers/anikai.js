const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Proviamo sorgente Zoro per:", title);
        
        // Usiamo un'istanza di un altro aggregatore (Zoro/Aniwatch)
        const baseUrl = "https://api.consumet.org/anime/zoro";
        
        const searchRes = await axios.get(`${baseUrl}/${encodeURIComponent(title)}`, { timeout: 10000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Zoro: Nessun risultato.");
            return [];
        }

        const animeId = results[0].id;
        console.log("ID Zoro trovato:", animeId);

        // Recuperiamo gli episodi
        const infoRes = await axios.get(`${baseUrl}/info?id=${animeId}`);
        const episodes = infoRes.data.episodes;

        if (!episodes || episodes.length === 0) return [];

        // Prendiamo il primo episodio
        const epId = episodes[0].id;
        console.log("Recupero link per ep:", epId);

        // Recuperiamo i link video
        const watchRes = await axios.get(`${baseUrl}/watch?episodeId=${epId}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai Z-Mirror 🪐",
            title: `ENG - ${s.quality}`,
            url: s.url,
            isM3U8: true
        }));

    } catch (e) {
        console.log("Errore Sorgente Zoro:", e.message);
        return [];
    }
}

module.exports = { getStreams };
