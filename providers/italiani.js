const axios = require('axios');
const cheerio = require('cheerio');

// Esempio per AnimeWorld
async function getAnimeWorld(title) {
    try {
        const searchUrl = `https://www.animeworld.ac/api/search?keyword=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl);
        // AnimeWorld restituisce JSON nella ricerca API
        const anime = data.animes[0]; 
        if (!anime) return [];

        return [{
            name: "AnimeWorld",
            title: "Streaming ITA",
            url: `https://www.animeworld.ac/play/${anime.id}` // Nota: serve un resolver qui
        }];
    } catch (e) { return []; }
}

// Esempio per AnimeSaturn
async function getAnimeSaturn(title) {
    try {
        const searchUrl = `https://www.animesaturn.cx/search?file=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);
        const link = $('.anime-card a').first().attr('href');
        
        return [{
            name: "AnimeSaturn",
            title: "Streaming ITA",
            url: link
        }];
    } catch (e) { return []; }
}

module.exports = { getAnimeWorld, getAnimeSaturn };
