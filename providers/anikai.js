const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Generazione Link Universale per: ${title}`);

        // Puliamo il titolo per i motori di ricerca
        const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');

        // Creiamo una lista di sorgenti "Direct Embed" 
        // Queste non passano per API fragili, ma puntano a grandi aggregatori
        const streams = [
            {
                name: "Anikai Multi 🪐",
                title: `Streaming Multi-Lingua\n${title}`,
                // Usiamo vidsrc.to o simili che sono i più stabili al mondo
                url: `https://vidsrc.to/embed/anime/${cleanTitle}`
            },
            {
                name: "Anikai Server 2 🚀",
                title: `Backup High Speed\n${title}`,
                url: `https://vidsrc.me/embed/anime?last_episode=1&title=${encodeURIComponent(title)}`
            }
        ];

        console.log(`✅ Link generati per ${title}.`);
        return streams;

    } catch (e) {
        console.log(`❌ Errore generazione: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
