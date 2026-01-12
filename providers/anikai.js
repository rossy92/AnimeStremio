const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca specifica per:", title);
        
        // Usiamo un'istanza che sembra più stabile in questo momento
        const apiBase = "https://api.consumet.org/anime/gogoanime";
        
        // Cerchiamo il titolo
        const searchRes = await axios.get(`${apiBase}/${encodeURIComponent(title)}`, { timeout: 15000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) return [];

        // Filtro per Naruto: se cerchiamo Naruto, prendiamo esattamente l'ID "naruto"
        // Questo evita che il server impazzisca tra mille film e spin-off
        const animeId = title.toLowerCase() === 'naruto' ? 'naruto' : results[0].id;

        console.log("ID selezionato per il recupero:", animeId);

        // Prendi gli episodi
        const infoRes = await axios.get(`${apiBase}/info/${animeId}`);
        const episodes = infoRes.data.episodes;

        if (!episodes || episodes.length === 0) return [];

        // Testiamo l'episodio 1 di Naruto (o l'ultimo per altri anime)
        const epId = episodes[0].id;

        const watchRes = await axios.get(`${apiBase}/watch/${epId}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}\n${animeId.toUpperCase()}`,
            url: s.url,
            isM3U8: s.url.includes(".m3u8")
        }));

    } catch (e) {
        console.log("Errore durante il test:", e.message);
        return [];
    }
}

module.exports = { getStreams };
