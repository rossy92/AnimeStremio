const axios = require("axios");

async function getStreams(title) {
    try {
        const searchUrl = `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`;
        console.log(`[Anikai] Cerco link video per: ${title}`);
        
        const res = await axios.get(searchUrl, { timeout: 10000 });
        const results = res.data.results || [];

        if (results.length > 0) {
            const anime = results[0];
            const animeTitle = anime.title || title;
            console.log(`✅ Trovato: ${animeTitle}`);

            // 1. Prendiamo le info per avere gli episodi
            const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${anime.id}`);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length === 0) return [];

            // 2. Prendiamo l'ultimo episodio
            const lastEp = episodes[episodes.length - 1];
            console.log(`[Anikai] Recupero streaming per Ep: ${lastEp.number}`);

            // 3. Prendiamo il link video reale
            const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${lastEp.id}`);
            const sources = watchRes.data.sources || [];

            return sources.map(s => ({
                name: "Anikai Cinema 🪐",
                title: `${s.quality} - Ep. ${lastEp.number}\n${animeTitle}`,
                url: s.url, // Questo deve essere il link .m3u8 o .mp4
                behaviorHints: {
                    proxyHeaders: { "Referer": "https://gogoanime.bid/" },
                    notInterchangeable: true
                }
            }));
        }
    } catch (e) {
        console.log(`❌ Errore durante il recupero link: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
