const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Test Rotta Diretta per: ${title}`);

        const config = {
            timeout: 10000,
            headers: { "API_PASSWORD": PASSWORD }
        };

        // 1. Proviamo la rotta abbreviata (senza /anime/)
        const searchUrl = `${PROXY_URL}/gogoanime/${encodeURIComponent(title)}?API_PASSWORD=${PASSWORD}`;
        const res = await axios.get(searchUrl, config);

        if (res.data && res.data.results && res.data.results.length > 0) {
            const anime = res.data.results[0];
            console.log(`✅ TROVATO! ID: ${anime.id}`);

            // 2. Info (Senza /anime/)
            const infoUrl = `${PROXY_URL}/gogoanime/info/${anime.id}?API_PASSWORD=${PASSWORD}`;
            const infoRes = await axios.get(infoUrl, config);
            const episodes = infoRes.data.episodes || [];
            if (episodes.length === 0) return [];

            const lastEp = episodes[episodes.length - 1];
            
            // 3. Watch (Senza /anime/)
            const watchUrl = `${PROXY_URL}/gogoanime/watch/${lastEp.id}?API_PASSWORD=${PASSWORD}`;
            const watchRes = await axios.get(watchUrl, config);

            return (watchRes.data.sources || []).map(s => ({
                name: "Anikai Private 🪐",
                title: `${s.quality} - ${anime.title}\nEp. ${lastEp.number}`,
                url: s.url,
                behaviorHints: {
                    proxyHeaders: { "Referer": "https://gogoanime.bid/" }
                }
            }));
        }
    } catch (e) {
        console.log(`❌ Ancora 404 sulla rotta diretta.`);
    }

    return [];
}

module.exports = { getStreams };
