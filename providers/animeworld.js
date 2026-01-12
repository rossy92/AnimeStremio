const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Cerco su AW:", title);
        const searchUrl = `https://www.animeworld.so/api/search?keyword=${encodeURIComponent(title)}`;
        
        const response = await axios.get(searchUrl, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.animeworld.so/',
                'Accept': 'application/json'
            }
        });

        if (response.data && response.data.animes && response.data.animes.length > 0) {
            const anime = response.data.animes[0];
            return [{
                name: "AnimeWorld",
                title: `🎬 ${anime.name} (Disponibile)`,
                url: `https://www.animeworld.so/play/${anime.link}` 
            }];
        }
        return [];
    } catch (e) {
        console.log("Errore AW:", e.message);
        return [];
    }
}

module.exports = { getStreams };
