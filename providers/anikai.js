const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";

async function getStreams(title) {
    // Proviamo le rotte "nude" senza sottocartelle
    const paths = [
        `${PROXY_URL}/search/${encodeURIComponent(title)}`,
        `${PROXY_URL}/${encodeURIComponent(title)}`,
        `${PROXY_URL}/anilist/${encodeURIComponent(title)}`
    ];

    for (const url of paths) {
        try {
            console.log(`Bussando a: ${url}`);
            const res = await axios.get(url, { timeout: 5000 });
            
            // Se risponde con dei risultati, abbiamo trovato la rotta!
            if (res.data && (res.data.results || Array.isArray(res.data))) {
                const results = res.data.results || res.data;
                if (results.length > 0) {
                    console.log(`✅ TROVATO! La rotta giusta è: ${url}`);
                    const anime = results[0];

                    // Cerchiamo di prendere gli episodi (spesso l'ID è sufficiente)
                    const infoUrl = url.replace(encodeURIComponent(title), `info/${anime.id}`);
                    const info = await axios.get(infoUrl);
                    const episodes = info.data.episodes || [];

                    if (episodes.length > 0) {
                        const lastEp = episodes[episodes.length - 1];
                        const watchUrl = url.replace(encodeURIComponent(title), `watch/${lastEp.id}`);
                        const watch = await axios.get(watchUrl);

                        return (watch.data.sources || []).map(s => ({
                            name: "Anikai Private 🪐",
                            title: `${s.quality} - ${anime.title}`,
                            url: s.url
                        }));
                    }
                }
            }
        } catch (e) {
            console.log(`❌ Fallito: ${url.split('/').pop()} - Errore: ${e.message}`);
        }
    }
    
    // Se tutto fallisce, usiamo un link esterno così almeno puoi vedere l'anime
    console.log("Il proxy non risponde a nessuna rotta nota. Uso link di backup.");
    return [{
        name: "Anikai Backup 🚀",
        title: `Clicca qui se il proxy fallisce\n${title}`,
        externalUrl: `https://www.2embed.cc/embed/anime/${encodeURIComponent(title)}`
    }];
}

module.exports = { getStreams };
