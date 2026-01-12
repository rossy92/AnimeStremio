const axios = require('axios');
const cheerio = require('cheerio');

async function getAnimeGGStreams(title) {
    try {
        // 1. Cerca l'anime su AnimeGG
        const searchUrl = `https://www.animegg.org/search/?q=${encodeURIComponent(title)}`;
        const { data: searchHtml } = await axios.get(searchUrl);
        const $search = cheerio.load(searchHtml);
        
        // Prendi il primo risultato
        const animeLink = $search('.anime-column a').first().attr('href');
        if (!animeLink) return [];

        // 2. Vai alla pagina degli episodi (es. aggiungendo #sub o simili se necessario)
        const fullLink = `https://www.animegg.org${animeLink}#sub`;
        
        return [{
            name: "AnimeGG",
            title: "Sub English - SD/HD",
            url: fullLink // Nota: AnimeGG usa spesso player come StreamTape
        }];
    } catch (e) {
        return [];
    }
}

module.exports = { getAnimeGGStreams };
