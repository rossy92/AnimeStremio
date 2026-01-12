const axios = require("axios");

// Usiamo l'istanza ufficiale di Consumet che ha tutto il database Anime
const BASE_URL = "https://api.consumet.org/anime/gogoanime";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Ricerca globale per: ${title}`);

        // 1. Cerchiamo l'ID dell'anime
        const searchRes = await axios.get(`${BASE_URL}/${encodeURIComponent(title)}`, { timeout: 10000 });
        const results = searchRes.data.results;

        if (results && results.length > 0) {
            const anime = results[0];
            console.log(`✅ Anime trovato: ${anime.title}`);

            // 2. Recuperiamo la lista episodi
            const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${anime.id}`);
            const episodes = infoRes.data.episodes;

            if (!episodes || episodes.length === 0) {
                console.log("Nessun episodio trovato.");
                return [];
            }

            // Prendiamo l'ultimo episodio (o quello disponibile)
            const lastEp = episodes[episodes.length - 1];
            console.log(`Recupero link per Episodio ${lastEp.number}`);

            // 3. Otteniamo i link video reali
            const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${lastEp.id}`);
            
            return (watchRes.data.sources || []).map(s => ({
                name: "Anikai Cinema 🪐",
                title: `${s.quality} - Ep. ${lastEp.number}\n${anime.title}`,
                url: s.url,
                behaviorHints: {
                    proxyHeaders: { 
                        "Referer": "https://gogoanime.bid/",
                        "User-Agent": "Mozilla/5.0"
                    }
                }
            }));
        } else {
            console.log("Nessun risultato trovato sul database globale.");
        }
    } catch (e) {
        console.log(`❌ Errore sistema: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
