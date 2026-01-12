const axios = require("axios");

async function getStreams(title, episode = "1") {
    try {
        // Puliamo il titolo per creare lo slug di GogoAnime
        const slug = title.toLowerCase()
            .replace(/'/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Proviamo a puntare a un server di streaming comune (Vidstreaming)
        // Molti addon usano questa struttura per "saltare" le API
        const videoUrl = `https://play202.com/embed?id=${slug}-episode-${episode}`;

        return [
            {
                name: "Anikai ENG ⚡",
                title: `DIRECT: ${title}\nEpisode ${episode} (Alpha Test)`,
                url: videoUrl,
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: {
                        "Referer": "https://gogoanime3.co/",
                        "User-Agent": "Mozilla/5.0"
                    }
                }
            },
            {
                name: "Anikai ENG 🇬🇧",
                title: `Backup: Search on HiAnime`,
                externalUrl: `https://hianime.to/search?keyword=${encodeURIComponent(title)}`
            }
        ];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
