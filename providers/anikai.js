const axios = require("axios");

async function getStreams(title) {
    try {
        console.log(`[Anikai] Step 1: Ricerca ID per ${title}`);
        const searchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`, { timeout: 15000 });
        const anime = searchRes.data.results?.[0];

        if (!anime) {
            console.log("❌ Nessun anime trovato con questo nome.");
            return [];
        }

        console.log(`[Anikai] Step 2: Caricamento episodi per ${anime.id}`);
        const infoRes = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${anime.id}`, { timeout: 15000 });
        const episodes = infoRes.data.episodes || [];

        if (episodes.length === 0) {
            console.log("❌ Lista episodi vuota.");
            return [];
        }

        // Prendiamo l'ultimo episodio
        const lastEp = episodes[episodes.length - 1];
        console.log(`[Anikai] Step 3: Recupero link video per episodio ${lastEp.number}`);

        const watchRes = await axios.get(`https://api.consumet.org/anime/gogoanime/watch/${lastEp.id}`, { timeout: 15000 });
        const sources = watchRes.data.sources || [];

        if (sources.length === 0) {
            console.log("❌ Nessun link streaming (source) trovato.");
            return [];
        }

        console.log(`✅ Successo! Inviati ${sources.length} link a Stremio.`);
        return sources.map(s => ({
            name: "Anikai Cinema 🪐",
            title: `${s.quality} - Ep. ${lastEp.number}\n${anime.title}`,
            url: s.url,
            behaviorHints: {
                proxyHeaders: { "Referer": "https://gogoanime.bid/" }
            }
        }));

    } catch (e) {
        console.log(`❌ Errore durante il processo: ${e.message}`);
        return [];
    }
}

module.exports = { getStreams };
