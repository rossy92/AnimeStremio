const axios = require("axios");
const cheerio = require("cheerio");

async function getStreams(title) {
    try {
        return [{
            name: "Anikai ENG 🇬🇧",
            title: `Search on Gogo: ${title}`,
            externalUrl: "https://gogoanime3.co"
        }];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
