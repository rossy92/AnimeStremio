const axios = require("axios");

async function getStreams(id) {
    try {
        const parts = id.split(':');
        const episodeNumber = parts[2] || 1;
        
        const consumetUrl = "https://api.consumet.org/anime/gogoanime";

        // Cerchiamo i link per GogoAnime (versione Dub)
        const searchRes = await axios.get(`${consumetUrl}/${id}`);
        if (!searchRes.data || !searchRes.data.results) return [];

        const animeId = searchRes.data.results.find(a => a.id.includes("-dub"))?.id || searchRes.data.results[0].id;

        const streamRes = await axios.get(`${consumetUrl}/watch/${animeId}-episode-${episodeNumber}`);

        return streamRes.data.sources.map(source => ({
            name: "GogoAnime (Fallback)",
            title: `Quality: ${source.quality} - Dub`,
            url: source.url
        }));

    } catch (error) {
        console.error("Errore Fallback API:", error.message);
        return [];
    }
}

module.exports = { getStreams };
