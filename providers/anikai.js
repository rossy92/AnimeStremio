const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca multi-provider per:", title);
        
        // Usiamo un'istanza pubblica di Consumet che aggrega Anikai, Gogo e altri
        const searchUrl = `https://consumet-api-production-e628.up.railway.app/anime/gogoanime/${encodeURIComponent(title)}`;
        const { data: searchData } = await axios.get(searchUrl, { timeout: 8000 });

        if (!searchData.results || searchData.results.length === 0) return [];

        // Prendiamo il primo anime trovato e recuperiamo gli episodi
        const animeId = searchData.results[0].id;
        const infoUrl = `https://consumet-api-production-e628.up.railway.app/anime/gogoanime/info/${animeId}`;
        const { data: infoData } = await axios.get(infoUrl);

        if (!infoData.episodes || infoData.episodes.length === 0) return [];

        // Prendiamo i link dell'episodio 1 (per test rapido)
        const episodeId = infoData.episodes[0].id;
        const watchUrl = `https://consumet-api-production-e628.up.railway.app/anime/gogoanime/watch/${episodeId}`;
        const { data: streamData } = await axios.get(watchUrl);

        // Trasformiamo i sorgenti video in link per Stremio
        return streamData.sources.map(s => ({
            name: "Anikai/Multi 🪐",
            title: `ENG - ${s.quality}\n${infoData.title}`,
            url: s.url
        }));

    } catch (e) {
        console.log("Errore Provider:", e.message);
        return [];
    }
}

module.exports = { getStreams };
