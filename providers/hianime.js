const axios = require("axios");

async function getStreams(title) {
    try {
        // Formattiamo il titolo per la ricerca
        const searchUrl = `https://hianime.to/search?keyword=${encodeURIComponent(title)}`;
        
        return [{
            name: "Anikai ENG 🇬🇧",
            title: `Watch ${title} on HiAnime\n(Sub/Dub - 1080p)`,
            externalUrl: searchUrl
        }];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
