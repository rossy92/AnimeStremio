const axios = require("axios");

// Il tuo proxy personale (senza slash finale)
const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";

async function getStreams(title) {
    try {
        console.log(`[Anikai] Provo il tuo proxy per: ${title}`);
        
        // 1. Proviamo la ricerca (rimosso il prefisso /anime/ che spesso causa 404)
        // La struttura standard di molti proxy è: PROXY_URL/gogoanime/TITOLO
        const searchUrl = `${PROXY_URL}/gogoanime/${encodeURIComponent(title)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 10000 });
        
        const results = searchRes.data.results;
        if (!results || results.length === 0) {
            console.log("Nessun risultato trovato sul proxy.");
            return [];
        }

        const animeId = results[0].id;
        console.log(`Trovato! ID: ${animeId}`);

        // 2. Info episodi
        const infoRes = await axios.get(`${PROXY_URL}/info/${animeId}`);
        const episodes = infoRes.data.episodes;
        if (!episodes || episodes.length === 0) return [];

        const lastEp = episodes[episodes.length - 1];

        // 3. Link video
        const watchRes = await axios.get(`${PROXY_URL}/watch/${lastEp.id}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai Private 🪐",
            title: `${s.quality} - Ep.${lastEp.number}\n${results[0].title}`,
            url: s.url,
            behaviorHints: {
                proxyHeaders: {
                    "Referer": "https://gogoanime.bid/",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        }));

    } catch (e) {
        console.log(`Errore Proxy (${e.response ? e.response.status : "Network"}):`, e.message);
        return [];
    }
}

module.exports = { getStreams };
