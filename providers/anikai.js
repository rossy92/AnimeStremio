const axios = require("axios");

// Cambiamo istanza: usiamo un mirror più stabile o quello di backup
const BASE_URL = "https://consumet-api-production-e619.up.railway.app/anime/gogoanime";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Tentativo su Mirror Secondario: ${title}`);

        // 1. Ricerca
        const searchRes = await axios.get(`${BASE_URL}/${encodeURIComponent(title)}`, { timeout: 10000 });
        const results = searchRes.data.results || [];

        if (results.length > 0) {
            // Cerchiamo il match migliore (spesso il primo)
            const anime = results[0];
            console.log(`✅ Trovato: ${anime.title}`);

            // 2. Info (usando lo stesso mirror)
            const infoUrl = `https://consumet-api-production-e619.up.railway.app/anime/gogoanime/info/${anime.id}`;
            const infoRes = await axios.get(infoUrl);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length === 0) return [];
            
            // Prendiamo il primo episodio per testare se i link caricano
            const firstEp = episodes[0]; 
            
            // 3. Streaming
            const watchUrl = `https://consumet-api-production-e619.up.railway.app/anime/gogoanime/watch/${firstEp.id}`;
            const watchRes = await axios.get(watchUrl);

            return (watchRes.data.sources || []).map(s => ({
                name: "Anikai 🪐",
                title: `${s.quality} - Ep. ${firstEp.number}\n${anime.title}`,
                url: s.url,
                behaviorHints: {
                    proxyHeaders: { "Referer": "https://gogoanime.bid/" }
                }
            }));
        } else {
            console.log("❌ Nessun risultato neanche sul mirror.");
        }
    } catch (e) {
        console.log(`❌ Errore Mirror: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
