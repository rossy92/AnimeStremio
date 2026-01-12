const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    try {
        console.log(`[UnHided-Gogo] Cerco: ${title}`);

        const config = {
            timeout: 10000,
            headers: { "api_password": PASSWORD }
        };

        // Molti fork di UnHided usano /anime/gogoanime/ oppure semplicemente /gogoanime/
        // Proviamo la versione più pulita che spesso rimane attiva
        const searchUrl = `${PROXY_URL}/anime/gogoanime/${encodeURIComponent(title)}`;
        const res = await axios.get(searchUrl, config);

        if (res.data && res.data.results && res.data.results.length > 0) {
            const anime = res.data.results[0];
            console.log(`✅ Trovato su Gogo: ${anime.title}`);

            const infoUrl = `${PROXY_URL}/anime/gogoanime/info/${anime.id}`;
            const infoRes = await axios.get(infoUrl, config);
            const episodes = infoRes.data.episodes || [];

            if (episodes.length > 0) {
                const lastEp = episodes[episodes.length - 1];
                const watchUrl = `${PROXY_URL}/anime/gogoanime/watch/${lastEp.id}`;
                const watchRes = await axios.get(watchUrl, config);

                return (watchRes.data.sources || []).map(s => ({
                    name: "Anikai Private 🪐",
                    title: `${s.quality} - ${anime.title}\nEp. ${lastEp.number}`,
                    url: s.url,
                    behaviorHints: { proxyHeaders: { "Referer": "https://gogoanime.bid/" } }
                }));
            }
        }
    } catch (e) {
        console.log(`❌ Errore Gogo: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
