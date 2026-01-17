const axios = require("axios");

async function getStreams(id) {
    try {
        // Stremio ID format: "tt12345:1:1" o "kitsu:1234:1"
        const parts = id.split(':');
        const episodeNumber = parts[2] || 1;
        
        // Usiamo l'API di Consumet per cercare e ottenere i link di AnimePahe
        // Nota: Questo è un server pubblico, se diventa lento puoi usarne uno tuo
        const consumetUrl = "https://api.consumet.org/anime/animepahe";

        // 1. Cerchiamo l'anime (usando l'id come query o cercando il titolo)
        // Per semplicità qui usiamo una ricerca fissa, ma l'ideale sarebbe mappare l'ID
        const searchRes = await axios.get(`${consumetUrl}/${id}`);
        
        if (!searchRes.data || !searchRes.data.results) return [];

        const animeId = searchRes.data.results[0].id;

        // 2. Otteniamo i link per l'episodio specifico
        const streamRes = await axios.get(`${consumetUrl}/watch/${episodeNumber}?id=${animeId}`);

        return streamRes.data.sources.map(source => ({
            name: "AnimePahe (Consumet)",
            title: `Quality: ${source.quality} - Dub`,
            url: source.url,
            behaviorHints: {
                notWebReady: false
            }
        }));

    } catch (error) {
        console.error("Errore AnimePahe API:", error.message);
        return [];
    }
}

module.exports = { getStreams };
