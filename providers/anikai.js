const axios = require("axios");

async function getStreams(title) {
    try {
        // 1. Cerchiamo l'ID dell'anime su Anikai
        // Usiamo l'endpoint di ricerca pubblico
        const searchUrl = `https://api.anikai.com/v1/anime/search?q=${encodeURIComponent(title)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 5000 });

        if (!searchRes.data || searchRes.data.length === 0) return [];

        // Prendiamo il primo risultato trovato
        const anime = searchRes.data[0];
        const animeId = anime.id;

        // 2. Recuperiamo i link degli episodi
        // Nota: Qui cerchiamo i link video dell'ultimo episodio disponibile
        const infoUrl = `https://api.anikai.com/v1/anime/${animeId}/episodes`;
        const infoRes = await axios.get(infoUrl);

        if (!infoRes.data || infoRes.data.length === 0) return [];

        const lastEpisode = infoRes.data[infoRes.data.length - 1];
        
        // 3. Formattiamo i risultati per Stremio
        // Anikai solitamente offre diverse qualità
        return [{
            name: "Anikai 🪐",
            title: `${anime.title.romaji}\nEp. ${lastEpisode.number} - ${lastEpisode.title || 'Multi Quality'}`,
            url: lastEpisode.videoUrl // Assicurati che l'API restituisca un link diretto
        }];

    } catch (e) {
        console.log("Errore Anikai:", e.message);
        return [];
    }
}

module.exports = { getStreams };
