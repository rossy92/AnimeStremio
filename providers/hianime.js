const axios = require("axios");

async function getStreams(title) {
    try {
        // Puliamo il titolo per creare un link probabile al file mp4
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        
        // Esistono dei server "embed" che Stremio legge meglio
        // Proviamo a puntare al player diretto di Gogo
        const directPlayerUrl = `https://play202.com/embed?id=${slug}-episode-1`;

        return [
            {
                name: "Anikai ENG 🇬🇧",
                title: `DIRECT PLAY: ${title}\n(Experimental Auto-Play)`,
                url: directPlayerUrl, // Usiamo URL invece di externalUrl
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
