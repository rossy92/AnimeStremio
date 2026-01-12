const axios = require("axios");

async function getStreams(title) {
    try {
        // Usiamo un mirror diverso (AnimePahe o simile tramite consumet)
        // Questo endpoint è solitamente più reattivo di Gogoanime
        const searchUrl = `https://api-consumet-org-five.vercel.app/anime/animepahe/${encodeURIComponent(title)}`;
        
        console.log(`[Anikai] Ricerca su sorgente alternativa: ${title}`);
        const res = await axios.get(searchUrl, { timeout: 10000 });
        
        const results = res.data.results || [];

        if (results.length > 0) {
            const anime = results[0];
            console.log(`✅ Trovato: ${anime.title}`);

            // Recuperiamo info episodi
            const infoRes = await axios.get(`https://api-consumet-org-five.vercel.app/anime/animepahe/info/${anime.id}`);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length === 0) return [];
            const lastEp = episodes[episodes.length - 1];

            // Recuperiamo i link video
            const watchRes = await axios.get(`https://api-consumet-org-five.vercel.app/anime/animepahe/watch/${lastEp.id}`);
            const sources = watchRes.data.sources || [];

            console.log(`🚀 Invio ${sources.length} link a Stremio`);

            return sources.map(s => ({
                name: "Anikai High 🪐",
                title: `${s.quality} - Ep. ${lastEp.number}\n${anime.title}`,
                url: s.url
            }));
        } else {
            console.log("❌ Anche questa sorgente non ha restituito risultati.");
        }
    } catch (e) {
        console.log(`❌ Errore critico: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
