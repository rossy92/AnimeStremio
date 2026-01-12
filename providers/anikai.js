const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca Anikai per:", title);
        
        // Usiamo un endpoint di ricerca alternativo e più stabile
        const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`;
        const response = await axios.get(searchUrl, { timeout: 10000 });

        const results = response.data.results;
        if (!results || results.length === 0) {
            console.log("Nessun risultato trovato.");
            return [];
        }

        const animeId = results[0].id;
        console.log("ID Trovato:", animeId);

        // Recuperiamo i dettagli dell'ultimo episodio
        const infoUrl = `https://api.consumet.org/anime/gogoanime/info/${animeId}`;
        const info = await axios.get(infoUrl);
        
        if (!info.data.episodes || info.data.episodes.length === 0) return [];

        const lastEp = info.data.episodes[info.data.episodes.length - 1];
        
        // Restituiamo il link dello streaming
        // Nota: Il nome visualizzato sarà quello che desideri tu
        return [{
            name: "Anikai 🪐",
            title: `ENG - Ep ${lastEp.number}\n${results[0].title}`,
            url: `https://shaka-player.vercel.app/?url=https://api.consumet.org/anime/gogoanime/watch/${lastEp.id}`
        }];

    } catch (e) {
        console.log("Errore Anikai:", e.message);
        return [];
    }
}

module.exports = { getStreams };
