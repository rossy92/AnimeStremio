const axios = require('axios');
const cheerio = require('cheerio');

async function getAnikaiStreams(stremioId, type) {
    try {
        // 1. Puliamo l'ID per capire cosa cercare
        // Stremio manda ID come "tt1234567:1:1" o "kitsu:anime-name:1"
        let searchTitle = "";
        
        if (stremioId.startsWith("kitsu:")) {
            // Se usi Kitsu, il titolo è spesso nell'ID stesso
            searchTitle = stremioId.split(":")[1].replace(/-/g, " ");
        } else {
            // Se usi IMDb (tt...), per ora mettiamo un fallback
            // In futuro qui useremo una fetch per trasformare tt123 in "Titolo"
            searchTitle = "One Piece"; // Prova a cambiare questo manualmente per testare altri anime
        }

        console.log("Ricerca su AniKai per:", searchTitle);
        
        const searchUrl = `https://anikai.to/search?q=${encodeURIComponent(searchTitle)}`;
        const { data: searchHtml } = await axios.get(searchUrl);
        const $search = cheerio.load(searchHtml);
        
        const animeLink = $search('.anime-card a').first().attr('href');
        if (!animeLink) return [];

        const { data: animeHtml } = await axios.get(animeLink);
        const $anime = cheerio.load(animeHtml);
        
        const streams = [];
        $anime('a.btn-stream').each((i, el) => {
            const streamUrl = $anime(el).attr('href');
            const quality = $anime(el).text().trim() || "HD";
            
            streams.push({
                name: "AniKai",
                title: `${searchTitle} - ${quality}`,
                url: streamUrl
            });
        });

        return streams;
    } catch (error) {
        console.error("Errore AniKai:", error.message);
        return [];
    }
}

module.exports = { getAnikaiStreams };
