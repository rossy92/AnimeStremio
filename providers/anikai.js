const axios = require("axios");
const cheerio = require("cheerio");

const AW_DOMAIN = "https://www.animeworld.so";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Ricerca video per: ${title}`);
        
        // 1. Cerchiamo l'anime
        const { data: searchHtml } = await axios.get(`${AW_DOMAIN}/filter?keyword=${encodeURIComponent(title)}`, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        
        const $ = cheerio.load(searchHtml);
        const animeLink = $("a.poster").first().attr("href");
        if (!animeLink) return [];

        // 2. Prendiamo la pagina dell'anime
        const { data: animeHtml } = await axios.get(`${AW_DOMAIN}${animeLink}`);
        const $anime = cheerio.load(animeHtml);
        const lastEpLink = $anime("a.episode").last().attr("href");

        if (!lastEpLink) return [];

        // 3. Estraiamo il video (Logica semplificata Streamvix)
        // Invece di mandare l'utente sul sito, proviamo a mandare lo stream
        return [{
            name: "Anikai ITA 🇮🇹",
            title: `AnimeWorld: ${title}\n(Tocca per avviare)`,
            // Usiamo un proxy o il link diretto se disponibile
            url: `${AW_DOMAIN}${lastEpLink}`, 
            behaviorHints: {
                notInterchangeable: true,
                // Questo istruisce Stremio ad aprire il link con il player interno
                proxyHeaders: { "Referer": AW_DOMAIN }
            }
        }];

    } catch (e) {
        console.log("Errore:", e.message);
        return [];
    }
}

module.exports = { getStreams };
