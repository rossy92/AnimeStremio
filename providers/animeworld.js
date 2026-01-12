const axios = require("axios");

async function getStreams(title) {
    try {
        // Rimuoviamo eventuali scorie dal titolo
        const cleanTitle = title.replace(/kitsu|tt|\d+/gi, '').trim();
        const searchUrl = `https://www.animeworld.so/api/search?keyword=${encodeURIComponent(cleanTitle || title)}`;
        
        const response = await axios.get(searchUrl, { timeout: 5000 });

        if (response.data && response.data.animes && response.data.animes.length > 0) {
            const anime = response.data.animes[0];
            return [{
                name: "AnimeWorld",
                title: `🎬 ${anime.name}`,
                url: `https://www.animeworld.so/play/${anime.link}`
            }];
        }
        return [];
    } catch (e) {
        return [];
    }
}

// IL NOME QUI SOTTO DEVE ESSERE UGUALE A QUELLO SOPRA
module.exports = { getStreams };
