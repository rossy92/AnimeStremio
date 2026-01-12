const axios = require("axios");
const cheerio = require("cheerio");

const GOGO_DOMAIN = "https://gogoanime3.co";

async function getStreams(title) {
    try {
        console.log(`[Gogo] Ricerca: ${title}`);
        
        // Ricerca su GogoAnime
        const searchUrl = `${GOGO_DOMAIN}/search.html?keyword=${encodeURIComponent(title)}`;
        const { data: html } = await axios.get(searchUrl);
        const $ = cheerio.load(html);
        
        const firstResult = $("ul.items li a").first().attr("href");
        if (!firstResult) return [];

        // Costruiamo il link all'ultimo episodio (formato standard di Gogo)
        // Esempio: /category/death-note -> death-note-episode-1
        const animeId = firstResult.replace("/category/", "");
        const streamUrl = `${GOGO_DOMAIN}/${animeId}-episode-1`;

        return [{
            name: "Anikai ENG 🇬🇧",
            title: `GogoAnime - ${title}\nSub/Dub Global`,
            url: streamUrl,
            behaviorHints: {
                notInterchangeable: true
            }
        }];
    } catch (e) {
        console.log(`[Gogo] Errore: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
