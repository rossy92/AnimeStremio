const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca globale per:", title);
        
        // 1. Cerchiamo l'ID corretto su MyAnimeList (Jikan API - Sempre online)
        const searchRes = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`, { timeout: 5000 });
        
        if (!searchRes.data.data || searchRes.data.data.length === 0) {
            console.log("Nessun anime trovato su database globale.");
            return [];
        }

        const anime = searchRes.data.data[0];
        const animeTitle = anime.title;
        const animeId = anime.mal_id;

        console.log(`Anime confermato: ${animeTitle} (ID: ${animeId})`);

        // 2. Restituiamo un link generato per un player multi-sorgente
        // Questo tipo di link apre un player che cerca automaticamente i flussi migliori
        return [{
            name: "Anikai MULTI 🚀",
            title: `ENG - Multi Quality\n${animeTitle}`,
            url: `https://shaka-player.vercel.app/?url=https://api.consumet.org/anime/gogoanime/watch/${anime.title.toLowerCase().replace(/\s+/g, '-')}-episode-1`,
            isM3U8: true
        },
        {
            name: "Anikai Mirror 🪐",
            title: `ENG - Backup Stream\n${animeTitle}`,
            url: `https://www.2embed.cc/embed/anime/${animeId}/1/1` // Sistema di backup basato su ID
        }];

    } catch (e) {
        console.log("Errore Ricerca Globale:", e.message);
        return [];
    }
}

module.exports = { getStreams };
