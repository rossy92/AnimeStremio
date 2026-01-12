const axios = require("axios");
const cheerio = require("cheerio");

const GOGO_DOMAIN = "https://gogoanime3.co";

async function getStreams(title) {
    try {
        const searchUrl = `${GOGO_DOMAIN}/search.html?keyword=${encodeURIComponent(title)}`;
        const { data: html } = await axios.get(searchUrl);
        const $ = cheerio.load(html);
        const animePath = $("ul.items li a").first().attr("href");
        if (!animePath) return [];

        return [{
            name: "Anikai ENG 🇬🇧",
            title: `Apri su GogoAnime\n${title}`,
            externalUrl: `${GOGO_DOMAIN}${animePath}`,
        }];
    } catch (e) {
        return [];
    }
}
module.exports = { getStreams };
