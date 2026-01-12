const axios = require("axios");
const cheerio = require("cheerio");

async function getStreams(title) {
    try {
        const cleanTitle = title.split(/[:(]/)[0].trim();
        console.log("Ricerca su Saturn per:", cleanTitle);

        const searchUrl = `https://www.animesaturn.tv/animelist?search=${encodeURIComponent(cleanTitle)}`;
        
        const response = await axios.get(searchUrl, {
            timeout: 8000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        $('.item-list li').each((i, el) => {
            if (i < 2) {
                const name = $(el).find('h3 a').text().trim();
                const link = $(el).find('h3 a').attr('href');
                if (name && link) {
                    results.push({
                        name: "AnimeSaturn",
                        title: `🪐 ${name}`,
                        url: link
                    });
                }
            }
        });

        return results;
    } catch (e) {
        console.log("Errore Saturn:", e.message);
        return [];
    }
}

module.exports = { getStreams };
