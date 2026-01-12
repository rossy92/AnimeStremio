const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca Globale (Jikan) per:", title);
        
        // 1. Cerchiamo l'anime su MyAnimeList (Jikan non banna Koyeb)
        const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;
        const res = await axios.get(searchUrl, { timeout: 5000 });

        if (!res.data.data || res.data.data.length === 0) {
            console.log("Jikan: Nessun risultato trovato.");
            return [];
        }

        const anime = res.data.data[0];
        const malId = anime.mal_id;
        const animeTitle = anime.title;

        console.log(`Trovato: ${animeTitle} (ID MAL: ${malId})`);

        // 2. Generiamo i link usando un aggregatore di player esterni (2embed)
        // Questo sistema usa l'ID di MyAnimeList per trovare il video
        return [
            {
                name: "Anikai 🪐",
                title: `Multi-Quality\n${animeTitle}`,
                // Link al player esterno che gestisce i vari server
                url: `https://www.2embed.cc/embed/anime/${malId}/1/1`
            },
            {
                name: "Anikai Mirror 🚀",
                title: `High Speed\n${animeTitle}`,
                // Alternativa basata su un altro player stabile
                url: `https://anime-api.xyz/api/v1/stream/${encodeURIComponent(animeTitle)}`
            }
        ];

    } catch (e) {
        console.log("Errore Ricerca Jikan:", e.message);
        return [];
    }
}

module.exports = { getStreams };
