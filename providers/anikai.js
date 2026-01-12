const axios = require("axios");
const cheerio = require("cheerio");

const AW_DOMAIN = "https://www.animeworld.so";

async function getStreams(title) {
    try {
        const searchUrl = `${AW_DOMAIN}/filter?keyword=${encodeURIComponent(title)}`;
        const { data: searchHtml } = await axios.get(searchUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(searchHtml);
        const animeLink = $("a.poster").first().attr("href");
        if (!animeLink) return [];

        return [{
            name: "Anikai ITA 🇮🇹",
            title: `Apri su AnimeWorld\n${title}`,
            externalUrl: `${AW_DOMAIN}${animeLink}`, // Usiamo externalUrl per non far crashare Stremio
        }];
    } catch (e) {
        return [];
    }
}
module.exports = { getStreams };
