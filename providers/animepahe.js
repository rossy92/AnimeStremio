const axios = require("axios");
const { getTitleFromId } = require("../utils/helper");

async function getStreams(id) {
    try {
        const title = await getTitleFromId(id);
        if (!title) return [];

        const parts = id.split(':');
        const episode = parts[2] || 1;

        console.log(`[AnimePahe] Cerco stream per: ${title} - Ep: ${episode}`);

        const consumetUrl = "https://api.consumet.org/anime/animepahe";
        const searchRes = await axios.get(`${consumetUrl}/${encodeURIComponent(title)}`);
        
        if (!searchRes.data.results || searchRes.data.results.length === 0) return [];

        // Prendiamo il primo risultato della ricerca
        const animeId = searchRes.data.results[0].id;
        const streamRes = await axios.get(`${consumetUrl}/watch/${episode}?id=${animeId}`);

        return streamRes.data.sources.map(source => ({
            name: "AnimePahe",
            title: `${source.quality} - Dub`,
            url: source.url
        }));
    } catch (error) {
        return [];
    }
}

module.exports = { getStreams };
