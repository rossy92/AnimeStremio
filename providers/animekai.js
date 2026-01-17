const axios = require("axios");

async function getStreams(id) {
    try {
        const parts = id.split(':');
        const episode = parts[2] || 1;

        console.log(`[AnimeKai] Cerco stream per Ep: ${episode}`);

        // Struttura per il secondo provider
        return [
            {
                name: "AnimeKai",
                title: `Eng Dub - Ep ${episode} (Direct)`,
                url: "https://www.example.com/stream2.mp4", // Qui andrebbe l'URL estratto
                behaviorHints: {
                    notWebReady: false
                }
            }
        ];
    } catch (error) {
        console.error("Errore AnimeKai:", error.message);
        return [];
    }
}

module.exports = { getStreams };
