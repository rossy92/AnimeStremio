const axios = require("axios");
const cheerio = require("cheerio");

const AW_DOMAIN = "https://www.animeworld.so";

async function getStreams(title) {
    try {
        // 1. Cerca l'anime
        const searchUrl = `${AW_DOMAIN}/filter?keyword=${encodeURIComponent(title)}`;
        const { data: searchHtml } = await axios.get(searchUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        
        const $ = cheerio.load(searchHtml);
        const animeLink = $("a.poster").first().attr("href");
        
        if (!animeLink) return [];

        // 2. Vai alla pagina dell'anime e prendi l'ultimo episodio (o il primo)
        const { data: animeHtml } = await axios.get(`${AW_DOMAIN}${animeLink}`);
        const $anime = cheerio.load(animeHtml);
        
        // Prendiamo l'ID dell'episodio (AnimeWorld usa un sistema a server)
        const episodeId = $("a.episode").first().attr("data-id") || $("a.episode").first().attr("data-episode-id");
        const episodeUrl = $("a.episode").first().attr("href");

        return [{
            name: "Anikai ITA 🇮🇹",
            title: `Riproduci: ${title}\n(AnimeWorld Server)`,
            // Usiamo il link dell'episodio, ma istruiamo Stremio a non uscire
            url: `${AW_DOMAIN}${episodeUrl}`, 
            behaviorHints: {
                notInterchangeable: true,
                proxyHeaders: {
                    "Referer": AW_DOMAIN,
                    "User-Agent": "Mozilla/5.0"
                }
            }
        }];
    } catch (e) {
        console.log("Errore Anikai:", e.message);
        return [];
    }
}

module.exports = { getStreams };
