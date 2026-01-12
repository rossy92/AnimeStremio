const axios = require("axios");
const cheerio = require("cheerio");

async function getStreams(title) {
    try {
        // Pulizia del titolo: prendiamo solo le parole principali
        const cleanTitle = title.split(/[:(]/)[0].trim();
        console.log("Ricerca Web su AW per:", cleanTitle);

        // Usiamo la ricerca standard del sito, non l'API
        const searchUrl = `https://www.animeworld.so/animes?search=${encodeURIComponent(cleanTitle)}`;
        
        const response = await axios.get(searchUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        // Cerchiamo i titoli nella griglia dei risultati
        $('.anime-list .item').each((i, el) => {
            if (i < 2) { // Prendiamo i primi 2 risultati
                const name = $(el).find('.name').text().trim();
                const link = $(el).find('a.poster').attr('href');
                
                if (name && link) {
                    results.push({
                        name: "AnimeWorld",
                        title: `🎬 ${name}`,
                        url: `https://www.animeworld.so${link}`
                    });
                }
            }
        });

        if (results.length > 0) return results;
        
        console.log("Nessun risultato Web per:", cleanTitle);
        return [];
    } catch (e) {
        console.log("Errore Ricerca Web:", e.message);
        return [];
    }
}

module.exports = { getStreams };
