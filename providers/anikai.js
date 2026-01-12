const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Ricerca flusso video diretto per: ${title}`);
        
        // Usiamo un'istanza di backup che risponde ai file video diretti
        const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 8000 });
        const anime = searchRes.data.results?.[0];

        if (anime) {
            console.log(`✅ Trovato ID: ${anime.id}`);
            
            // 1. Prendiamo l'ID dell'episodio 1 (per testare)
            const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${anime.id}`);
            const firstEp = infoRes.data.episodes?.[0];

            if (firstEp) {
                // 2. Prendiamo il link del file .m3u8 (il formato che Stremio digerisce)
                const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${firstEp.id}`);
                const source = watchRes.data.sources?.find(s => s.quality === 'default' || s.quality === 'backup') || watchRes.data.sources?.[0];

                if (source && source.url) {
                    console.log(`🚀 Flusso video trovato! Inviando a Stremio...`);
                    return [{
                        name: "Anikai Cinema 🪐",
                        title: `Riproduzione Diretta - Ep. 1\n${anime.title}`,
                        url: source.url, // Questo è un link .m3u8, ora Stremio lo DEVE leggere
                        behaviorHints: {
                            notInterchangeable: true,
                            proxyHeaders: { 
                                "Referer": "https://gogoanime.bid/",
                                "User-Agent": "Mozilla/5.0" 
                            }
                        }
                    }];
                }
            }
        }
    } catch (e) {
        console.log(`❌ Errore durante il recupero: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
