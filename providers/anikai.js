const axios = require("axios");

// SOSTITUISCI QUESTO URL CON IL TUO PROXY PERSONALE
const URL_MIO_PROXY = "http://gay-toucan-newross-cd988fb6.koyeb.app";

async function getStreams(title) {
    try {
        console.log(`[Private Proxy] Cerco: ${title}`);
        
        // 1. Ricerca (Usando il tuo proxy)
        const searchRes = await axios.get(`${URL_MIO_PROXY}/anime/gogoanime/${encodeURIComponent(title)}`, { timeout: 15000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Nessun risultato trovato sul tuo proxy.");
            return [];
        }

        const animeId = results[0].id;
        console.log(`Trovato! ID: ${animeId}`);

        // 2. Info Episodi
        const infoRes = await axios.get(`${URL_MIO_PROXY}/anime/gogoanime/info/${animeId}`);
        const episodes = infoRes.data.episodes;
        if (!episodes || episodes.length === 0) return [];

        // Prendiamo l'ultimo episodio
        const lastEp = episodes[episodes.length - 1];

        // 3. Link Video
        const watchRes = await axios.get(`${URL_MIO_PROXY}/anime/gogoanime/watch/${lastEp.id}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai Private 🪐",
            title: `${s.quality} - Ep.${lastEp.number}\n${results[0].title}`,
            url: s.url,
            behaviorHints: {
                notWebReady: false,
                proxyHeaders: {
                    "Referer": "https://gogoanime.bid/",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        }));

    } catch (e) {
        console.log("Errore con il tuo proxy personale:", e.message);
        // Se il proxy personale fallisce, restituiamo un link di emergenza Jikan
        return [];
    }
}

module.exports = { getStreams };
