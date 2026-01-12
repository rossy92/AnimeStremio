const axios = require("axios");

async function getStreams(title) {
    try {
        // 1. Cerchiamo l'ID dell'anime tramite l'API di Consumet (GogoAnime provider)
        const searchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`, { timeout: 5000 });
        const anime = searchRes.data.results[0]; // Prendiamo il primo risultato

        if (!anime) return [];

        // 2. Prendiamo i link dell'episodio 1 (per ora testiamo il primo)
        const episodeId = `${anime.id}-episode-1`;
        const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}`);
        
        // 3. Estraiamo il link con qualità "default" o "hls" (m3u8)
        const streams = watchRes.data.sources.map(source => {
            return {
                name: "Anikai ENG ⚡",
                title: `DIRECT: ${title}\nQuality: ${source.quality}`,
                url: source.url, // Questo è il link DIRETTO al file video (.m3u8)
                behaviorHints: {
                    notInterchangeable: true
                }
            };
        });

        // Aggiungiamo sempre il backup esterno per sicurezza
        streams.push({
            name: "Anikai ENG 🇬🇧",
            title: `Backup: Browser Search`,
            externalUrl: `https://hianime.to/search?keyword=${encodeURIComponent(title)}`
        });

        return streams;
    } catch (e) {
        console.log("Errore API Consumet:", e.message);
        // Se l'API fallisce, restituiamo almeno il backup
        return [{
            name: "Anikai ENG 🇬🇧",
            title: `Search on HiAnime (API Down)`,
            externalUrl: `https://hianime.to/search?keyword=${encodeURIComponent(title)}`
        }];
    }
}

module.exports = { getStreams };
