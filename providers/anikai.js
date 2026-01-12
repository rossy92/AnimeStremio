const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Tentativo finale su proxy con password: ${title}`);

        const config = {
            timeout: 15000, // Aumentato a 15 secondi per dare tempo al trasporto di attivarsi
            headers: { 
                "api_password": PASSWORD,
                "API_PASSWORD": PASSWORD 
            }
        };

        // Proviamo la rotta ufficiale completa
        const searchUrl = `${PROXY_URL}/anime/gogoanime/${encodeURIComponent(title)}?API_PASSWORD=${PASSWORD}`;
        const res = await axios.get(searchUrl, config);

        if (res.data && res.data.results && res.data.results.length > 0) {
            const anime = res.data.results[0];
            console.log(`✅ PROXY SBLOCCATO! Trovato: ${anime.title}`);

            const infoUrl = `${PROXY_URL}/anime/gogoanime/info/${anime.id}?API_PASSWORD=${PASSWORD}`;
            const infoRes = await axios.get(infoUrl, config);
            const episodes = infoRes.data.episodes || [];
            if (episodes.length === 0) return [];

            const lastEp = episodes[episodes.length - 1];
            
            const watchUrl = `${PROXY_URL}/anime/gogoanime/watch/${lastEp.id}?API_PASSWORD=${PASSWORD}`;
            const watchRes = await axios.get(watchUrl, config);

            return (watchRes.data.sources || []).map(s => ({
                name: "Anikai Private 🪐",
                title: `${s.quality} - Ep.${lastEp.number}\n${anime.title}`,
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
        console.log(`❌ Stato errore: ${e.response ? e.response.status : 'Timeout/Network'}`);
        console.log(`Messaggio: ${e.message}`);
    }
    return [];
}

module.exports = { getStreams };
