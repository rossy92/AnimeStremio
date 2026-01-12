const axios = require("axios");
const cheerio = require("cheerio");
async function getStreams(title) {
    try {
        const searchUrl = `https://www.animesaturn.it/animelist?search=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl, { timeout: 5000 });
        const $ = cheerio.load(data);
        const link = $('ul.list-group li a').first().attr('href');
        return link ? [{ name: "AnimeSaturn", title: "🎬 Guarda su Saturn", url: link }] : [];
    } catch (e) { return []; }
}
module.exports = { getStreams };
