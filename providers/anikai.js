const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    try {
        console.log(`[UnHided] Ricerca anime: ${title}`);

        const config = {
            timeout: 15000,
            headers: { "api_password": PASSWORD }
        };

        // 1. Ricerca tramite la rotta specifica di UnHided (Anilist)
        const searchUrl = `${PROXY_URL}/meta/anilist/${encodeURIComponent(title)}`;
        const res = await axios.get(searchUrl, config);

        if (res.data && res.data.results && res.data.results.length > 0) {
            const anime = res.data.results[0];
            console.log(`✅ Anime trovato: ${anime.title}`);

            // 2. Recupero info e ID episodi
            const infoUrl = `${PROXY_URL}/meta/anilist/info/${anime.id}`;
            const infoRes = await axios.get(infoUrl, config);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length === 0) {
                console.log("Nessun episodio trovato per questo titolo.");
                return [];
            }

            // Prendiamo l'ultimo episodio disponibile
            const lastEp = episodes[episodes.length - 1];
            console.log(`Recupero link per episodio: ${lastEp.number}`);

            // 3. Recupero streaming tramite la rotta /watch (Gogoanime di default in UnHided)
            const watchUrl = `${PROXY_URL}/meta/anilist/watch/${lastEp.id}`;
            const watchRes = await axios.get(watchUrl, config);

            if (!watchRes.data || !watchRes.data.sources) return [];

            return watchRes.data.sources.map(s => ({
                name: "Anikai UnHided 🪐",
                title: `${s.quality} - Ep.${lastEp.number}\n${anime.title.romaji || anime.title}`,
                url: s.url,
                behaviorHints: {
                    proxyHeaders: {
                        "Referer": "https://gogoanime.bid/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                    }
                }
            }));
        }
    } catch (e) {
        console.log(`❌ Errore UnHided: ${e.message}`);
        if (e.response) console.log(`Dettaglio: ${JSON.stringify(e.response.data)}`);
    }

    return [];
}

module.exports = { getStreams };
