const axios = require("axios");

async function getStreams(title) {
    try {
        // Puliamo il titolo da eventuali scorie
        const cleanTitle = title.split('(')[0].trim();
        
        console.log("Ricerca su AW per:", cleanTitle);

        const searchUrl = `https://www.animeworld.so/api/search?keyword=${encodeURIComponent(cleanTitle)}`;
        
        const response = await axios.get(searchUrl, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.animeworld.so/'
            }
        });

        if (response.data && response.data.animes && response.data.animes.length > 0) {
            const anime = response.data.animes[0];
            // Creiamo il link alla pagina dell'anime
            const animeUrl = `https://www.animeworld.so/play/${anime.link}`;
            
            return [{
                name: "AnimeWorld",
                title: `🎬 ${anime.name}\n(Clicca per aprire sul sito)`,
                url: animeUrl
            }];
        }
        
        console.log("Nessun anime trovato su AW per:", cleanTitle);
        return [];
    } catch (e) {
        console.log("Errore chiamata AW:", e.message);
        return [];
    }
}

module.exports = { getStreams };
