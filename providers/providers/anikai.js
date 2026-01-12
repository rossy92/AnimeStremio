const axios = require('axios');
const cheerio = require('cheerio');

async function getAnikaiStreams(imdbId, type) {
    try {
        // 1. Converti IMDb ID in Titolo (Passaggio fondamentale)
        // Per ora usiamo un titolo di test, ma dovresti usare l'API di Kitsu o TMDB
        const searchTitle = "Naruto"; 
        
        // 2. Cerca l'anime su AniKai
        const searchUrl = `https://anikai.to/search?q=${encodeURIComponent(searchTitle)}`;
        const { data: searchHtml } = await axios.get(searchUrl);
        const $search = cheerio.load(searchHtml);
        
        // Prendi il primo risultato della ricerca
        const animeLink = $search('.anime-card a').first().attr('href');
        if (!animeLink) return [];

        // 3. Vai alla pagina dell'anime/episodio
        const { data: animeHtml } = await axios.get(animeLink);
        const $anime = cheerio.load(animeHtml);
        
        // Estrai il link del player (solitamente in un iframe o un bottone)
        const streams = [];
        $anime('a.btn-stream').each((i, el) => {
            const streamUrl = $anime(el).attr('href');
            const quality = $anime(el).text().trim() || "HD";
            
            streams.push({
                name: "AniKai",
                title: `Streaming ITA - ${quality}`,
                url: streamUrl // Assicurati che sia un link diretto .mp4 o .m3u8
            });
        });

        return streams;
    } catch (error) {
        console.error("Errore AniKai:", error.message);
        return [];
    }
}

module.exports = { getAnikaiStreams };
