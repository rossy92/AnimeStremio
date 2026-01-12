const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca link diretto per:", title);
        
        // Usiamo un'istanza di test che di solito è molto permissiva
        const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`;
        const searchRes = await axios.get(searchUrl);
        
        if (!searchRes.data.results || searchRes.data.results.length === 0) return [];

        const animeId = searchRes.data.results[0].id;

        // Prendiamo l'episodio 1
        const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${animeId}`);
        if (!infoRes.data.episodes || infoRes.data.episodes.length === 0) return [];
        
        const epId = infoRes.data.episodes[0].id;

        // Qui sta il trucco: chiediamo il link "diretto"
        const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${epId}`);
        
        // Filtriamo solo i link che Stremio può digerire (m3u8 o mp4)
        const streams = watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}`,
            url: s.url, // Questo deve essere un link che finisce per .m3u8
            tag: [s.quality]
        }));

        return streams;

    } catch (e) {
        console.log("Errore link diretto:", e.message);
        return [];
    }
}

module.exports = { getStreams };
