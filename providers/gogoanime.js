const axios = require("axios");
const cheerio = require("cheerio");

const GOGO_DOMAIN = "https://gogoanime3.co";

async function getStreams(title) {
    try {
        // 1. Cerca l'anime su GogoAnime
        const searchUrl = `${GOGO_DOMAIN}/search.html?keyword=${encodeURIComponent(title)}`;
        const { data: html } = await axios.get(searchUrl);
        const $ = cheerio.load(html);
        
        const animePath = $("ul.items li a").first().attr("href");
        if (!animePath) return [];

        // 2. Costruisce il link dell'episodio 1 (Esempio standard)
        // Nota: In un addon completo dovremmo estrarre l'episodio specifico dall'ID di Stremio
        const animeId = animePath.replace("/category/", "");
        const episodeUrl = `${GOGO_DOMAIN}/${animeId}-episode-1`;

        return [{
            name: "Anikai ENG 🇬🇧",
            title: `GogoAnime: ${title}\nEpisode 1 - High Quality`,
            url: episodeUrl,
            behaviorHints: {
                notInterchangeable: true,
                proxyHeaders: {
                    "Referer": GOGO_DOMAIN,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            }
        }];
    } catch (e) {
        console.log(`[Gogo] Errore: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
