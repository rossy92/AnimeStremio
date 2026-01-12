const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";

async function getStreams(title) {
    // Proviamo i 3 percorsi più probabili che i proxy Koyeb usano
    const pathsToTest = [
        `${PROXY_URL}/anime/gogoanime/${encodeURIComponent(title)}`,
        `${PROXY_URL}/gogoanime/${encodeURIComponent(title)}`,
        `${PROXY_URL}/meta/anilist/${encodeURIComponent(title)}`
    ];

    for (const url of pathsToTest) {
        try {
            console.log(`Tentativo su: ${url}`);
            const res = await axios.get(url, { timeout: 5000 });
            
            if (res.data && res.data.results && res.data.results.length > 0) {
                const anime = res.data.results[0];
                console.log(`✅ FUNZIONA! Trovato con: ${url}`);
                
                // Determiniamo la base per le info in base a cosa ha funzionato
                const isMeta = url.includes("/meta/");
                const infoUrl = isMeta 
                    ? `${PROXY_URL}/meta/anilist/info/${anime.id}`
                    : `${PROXY_URL}/info/${anime.id}`;

                const info = await axios.get(infoUrl);
                const episodes = info.data.episodes;
                if (!episodes || episodes.length === 0) continue;

                const lastEp = episodes[episodes.length - 1];
                const watchUrl = isMeta
                    ? `${PROXY_URL}/meta/anilist/watch/${lastEp.id}`
                    : `${PROXY_URL}/watch/${lastEp.id}`;

                const watch = await axios.get(watchUrl);

                return watch.data.sources.map(s => ({
                    name: "Anikai Private 🪐",
                    title: `${s.quality} - ${anime.title}`,
                    url: s.url
                }));
            }
        } catch (e) {
            console.log(`❌ Fallito ${url.split('/')[3]}: ${e.message}`);
            continue; 
        }
    }
    return [];
}

module.exports = { getStreams };
