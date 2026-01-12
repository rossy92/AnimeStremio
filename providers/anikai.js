const axios = require("axios");
const cheerio = require("cheerio");

async function getStreams(title) {
    try {
        // Versione ultra-light senza logica complessa per ora
        return [{
            name: "Anikai ITA 🇮🇹",
            title: `Ricerca per: ${title}`,
            externalUrl: "https://www.animeworld.so"
        }];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
