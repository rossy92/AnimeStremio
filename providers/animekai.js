const axios = require("axios");
const { getTitleFromId } = require("../utils/helper");

async function getStreams(id) {
    try {
        const title = await getTitleFromId(id);
        if (!title) return [];

        const parts = id.split(':');
        const episode = parts[2] || 1;

        const consumetUrl = "https://api.consumet.org/anime/gogoanime";
        // Cerchiamo la versione Dub direttamente
        const searchRes = await axios.get(`${consumetUrl}/${encodeURIComponent(title + " dub")}`);
        
        if (!searchRes.data.results || searchRes.data.results.length === 0) return [];

        const animeId = searchRes.data.results[0].id;
        const streamRes = await axios.get(`${consumetUrl}/watch/${animeId}-episode-${episode}`);

        return streamRes.data.sources.map(source => ({
            name: "GogoAnime",
            title: `Quality: ${source.quality} (Eng Dub)`,
            url: source.url
        }));
    } catch (error) {
        return [];
    }
}

module.exports = { getStreams };
