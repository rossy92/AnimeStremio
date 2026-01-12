const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca su Anikai per:", title);
        
        // 1. Cerchiamo l'ID dell'anime su Anikai (esempio tramite API pubblica)
        const searchUrl = `https://api.anikai.com/v1/anime/search?q=${encodeURIComponent(title)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 5000 });

        if (!searchRes.data || searchRes.data.length === 0) {
            console.log("Anikai: Nessun risultato trovato.");
            return [];
        }

        // Prendiamo il primo risultato (il più pertinente)
        const anime = searchRes.data[0];
        const animeId = anime.id;

        // 2. Recuperiamo gli episodi o i link diretti
        const infoUrl = `https://api.anikai.com/v1/anime/${animeId}/episodes`;
        const infoRes = await axios.get(infoUrl);

        if (!infoRes.data || infoRes.data.length === 0) return [];

        // Prendiamo l'ultimo episodio come esempio di test
        const lastEpisode = infoRes.data[infoRes.data.length - 1];
        
        // 3. Restituiamo l'array di stream per Stremio
        return [{
            name: "Anikai 🪐",
            title: `ENG - ${anime.title.romaji || title}\nEpisodio ${lastEpisode.number}`,
            url: lastEpisode.videoUrl // Il link diretto al file video
        }];

    } catch (e) {
        console.log("Errore interno Anikai:", e.message);
        return [];
    }
}

// Esportiamo la funzione così addon.js può vederla
module.exports = { getStreams };
