const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Tentativo di bypass per:", title);
        
        // Usiamo un aggregatore che non abbiamo ancora provato
        // Questo endpoint è specifico per animepahe
        const searchUrl = `https://api.consumet.org/anime/animepahe/${encodeURIComponent(title)}`;
        const res = await axios.get(searchUrl, { timeout: 8000 });

        if (!res.data || !res.data.results || res.data.results.length === 0) {
            console.log("Sorgente Pahe: Nessun risultato.");
            return [];
        }

        const animeId = res.data.results[0].id;
        console.log("Anime trovato su Pahe! ID:", animeId);

        // Prendiamo le info degli episodi
        const infoUrl = `https://api.consumet.org/anime/animepahe/info/${animeId}`;
        const info = await axios.get(infoUrl);

        if (!info.data || !info.data.episodes) return [];

        // Prendiamo l'ultimo episodio caricato
        const lastEp = info.data.episodes[info.data.episodes.length - 1];

        // Qui prendiamo i link video reali
        const watchUrl = `https://api.consumet.org/anime/animepahe/watch/${lastEp.id}`;
        const streams = await axios.get(watchUrl);

        return streams.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}\nEp. ${lastEp.number}`,
            url: s.url,
            behaviorHints: {
                notWebReady: false,
                proxyHeaders: { "Referer": "https://animepahe.com" }
            }
        }));

    } catch (e) {
        console.log("Errore critico Pahe:", e.message);
        return [];
    }
}

module.exports = { getStreams };
