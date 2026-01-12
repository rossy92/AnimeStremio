const axios = require("axios");
const cheerio = require("cheerio");

const AW_DOMAIN = "https://www.animeworld.so";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Ricerca professionale su AnimeWorld: ${title}`);
        
        // 1. Cerchiamo l'anime sul sito
        const searchUrl = `${AW_DOMAIN}/filter?keyword=${encodeURIComponent(title)}`;
        const { data: searchHtml } = await axios.get(searchUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        
        const $ = cheerio.load(searchHtml);
        const animeLink = $("a.poster").first().attr("href");

        if (!animeLink) {
            console.log("❌ Anime non trovato su AnimeWorld.");
            return [];
        }

        console.log(`✅ Trovato: ${AW_DOMAIN}${animeLink}`);

        // 2. Entriamo nella pagina dell'anime per prendere l'ultimo episodio
        const { data: animeHtml } = await axios.get(`${AW_DOMAIN}${animeLink}`);
        const $anime = cheerio.load(animeHtml);
        
        // Prendiamo l'ultimo episodio disponibile
        const lastEpTag = $anime("a.episode").last();
        const epLink = lastEpTag.attr("href");
        const epNum = lastEpTag.text().trim();

        if (!epLink) return [];

        // 3. Creiamo il link per Stremio
        // Usiamo un trucco: passiamo il link della pagina dell'episodio
        // Se l'addon è configurato bene, Stremio proverà ad aprirlo.
        return [{
            name: "Anikai ITA 🇮🇹",
            title: `AnimeWorld - Ep. ${epNum}\n${title}`,
            externalUrl: `${AW_DOMAIN}${epLink}`, // Usiamo externalUrl per sicurezza inizialmente
            behaviorHints: {
                notInterchangeable: true
            }
        }];

    } catch (e) {
        console.log(`❌ Errore Scraper: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
