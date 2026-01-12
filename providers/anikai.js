const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Ricerca Global (EN) per: ${title}`);
        
        // Pulizia del titolo per il database internazionale
        const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
        
        // Usiamo un'istanza di Consumet per Gogoanime
        const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(cleanTitle)}`;
        const res = await axios.get(searchUrl, { timeout: 10000 });
        const results = res.data.results || [];

        if (results.length > 0) {
            const anime = results[0];
            console.log(`✅ Trovato su Global DB: ${anime.title}`);

            // Otteniamo le info dell'anime per avere la lista episodi
            const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${anime.id}`);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length === 0) {
                console.log("❌ Nessun episodio trovato.");
                return [];
            }

            // Prendiamo il primo episodio per test
            const ep = episodes[0]; 
            console.log(`[Anikai] Recupero link video per episodio ${ep.number}`);

            // Otteniamo il link video REALE (.m3u8)
            const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${ep.id}`);
            const sources = watchRes.data.sources || [];

            if (sources.length === 0) {
                console.log("❌ Nessuna sorgente video trovata.");
                return [];
            }

            console.log(`🚀 Invio ${sources.length} link a Stremio`);
            return sources.map(s => ({
                name: "Anikai Global 🪐",
                title: `${s.quality} - Episode ${ep.number}\n${anime.title}`,
                url: s.url,
                behaviorHints: {
                    proxyHeaders: { "Referer": "https://gogoanime.bid/" },
                    notInterchangeable: true
                }
            }));
        } else {
            console.log("❌ Nessun risultato nel database inglese.");
        }
    } catch (e) {
        console.log(`❌ Errore connessione: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
