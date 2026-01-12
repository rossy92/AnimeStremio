const axios = require("axios");

async function getStreams(title, episode = "1") {
    try {
        // Pulizia estrema del titolo per lo slug
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Usiamo l'istanza di un player che tenta di bypassare i blocchi
        // Questo è un gateway comune per gli sviluppatori di addon
        const streamUrl = `https://vidsrc.me/embed/anime?last9=${slug}&ep=${episode}`;

        return [
            {
                name: "Anikai DIRECT 📺",
                title: `WATCH: ${title}\nEpisode ${episode} (Direct Stream)`,
                url: streamUrl, 
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: {
                        "Referer": "https://vidsrc.me/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
                    }
                }
            },
            {
                name: "Anikai SOURCE 🌐",
                title: `Open in Browser (HiAnime)\n${title} - Episode ${episode}`,
                externalUrl: `https://hianime.to/search?keyword=${encodeURIComponent(title)}`
            }
        ];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
