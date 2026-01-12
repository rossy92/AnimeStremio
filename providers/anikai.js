const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Generazione Link Diretti per: ${title}`);
        
        // Pulizia titolo per il link
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        return [
            {
                name: "Anikai Cinema 🪐",
                title: `Premi qui per avviare\n${title} (Multi-Lingua)`,
                // Usiamo l'ID di vidsrc che è lo standard più compatibile
                url: `https://vidsrc.to/embed/anime/${slug}`,
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: { "Referer": "https://vidsrc.to/" }
                }
            },
            {
                name: "Anikai Mirror 🚀",
                title: `Server Alternativo\n${title}`,
                url: `https://vidsrc.me/embed/anime?title=${encodeURIComponent(title)}`,
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: { "Referer": "https://vidsrc.me/" }
                }
            }
        ];
    } catch (e) {
        return [];
    }
}

module.exports = { getStreams };
