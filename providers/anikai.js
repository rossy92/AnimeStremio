const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Generazione link diretto (No-API) per: ${title}`);
        
        // Trasformiamo il titolo in un formato standard per i player (es: Death Note -> death-note)
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Creiamo una lista di server che caricano il video partendo dal nome
        return [
            {
                name: "Anikai Global 🪐",
                title: `Play: ${title}\n(Server Multi-Lingua)`,
                // Questo link punta direttamente al player universale
                url: `https://vidsrc.to/embed/anime/${slug}`,
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: { "Referer": "https://vidsrc.to/" }
                }
            },
            {
                name: "Anikai Mirror 🚀",
                title: `Play: ${title}\n(Backup Server)`,
                url: `https://vidsrc.me/embed/anime?title=${encodeURIComponent(title)}`,
                behaviorHints: {
                    notInterchangeable: true,
                    proxyHeaders: { "Referer": "https://vidsrc.me/" }
                }
            }
        ];
    } catch (e) {
        console.log(`❌ Errore: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
