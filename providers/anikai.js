const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    // Proviamo le rotte "pure" senza specificare gogoanime o anilist
    const routes = [
        `${PROXY_URL}/search?q=${encodeURIComponent(title)}`,
        `${PROXY_URL}/anime/${encodeURIComponent(title)}`,
        `${PROXY_URL}/api/search/${encodeURIComponent(title)}`
    ];

    const config = {
        timeout: 10000,
        headers: { "API_PASSWORD": PASSWORD }
    };

    for (const url of routes) {
        try {
            console.log(`[Scanner] Provo: ${url}`);
            // Proviamo sia con password in header che in query
            const finalUrl = `${url}${url.includes('?') ? '&' : '?'}API_PASSWORD=${PASSWORD}`;
            const res = await axios.get(finalUrl, config);
            
            const results = res.data.results || res.data;
            if (results && (Array.isArray(results) || results.length > 0)) {
                console.log(`✅ TROVATO! Rotta funzionante: ${url}`);
                const anime = Array.isArray(results) ? results[0] : results.results[0];

                // Proviamo a recuperare i link video
                const watchUrl = `${PROXY_URL}/watch/${anime.id}?API_PASSWORD=${PASSWORD}`;
                const watchRes = await axios.get(watchUrl, config);

                return (watchRes.data.sources || []).map(s => ({
                    name: "Anikai Private 🪐",
                    title: `${s.quality} - ${anime.title || title}`,
                    url: s.url
                }));
            }
        } catch (e) {
            console.log(`❌ Fallito ${url}: ${e.message}`);
        }
    }

    console.log("Nessuna rotta trovata. Prova a controllare il nome del provider nelle impostazioni del tuo proxy.");
    return [];
}

module.exports = { getStreams };
