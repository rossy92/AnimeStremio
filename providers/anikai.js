const axios = require("axios");

async function getStreams(title) {
    // Lista di mirror da provare in ordine
    const mirrors = [
        `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`,
        `https://api-consumet-org-five.vercel.app/anime/gogoanime/${encodeURIComponent(title)}`,
        `https://consumet-api-one.vercel.app/anime/gogoanime/${encodeURIComponent(title)}`
    ];

    for (const url of mirrors) {
        try {
            console.log("Tentativo su:", url);
            const res = await axios.get(url, { timeout: 6000 });
            
            if (res.data && res.data.results && res.data.results.length > 0) {
                const animeId = res.data.results[0].id;
                console.log("Successo! ID trovato:", animeId);

                // Recuperiamo le info dell'anime
                const baseUrl = url.split('/').slice(0, -1).join('/');
                const info = await axios.get(`${baseUrl}/info/${animeId}`);
                
                if (info.data.episodes && info.data.episodes.length > 0) {
                    const epId = info.data.episodes[0].id;
                    const watch = await axios.get(`${baseUrl}/watch/${epId}`);
                    
                    return watch.data.sources.map(s => ({
                        name: "Anikai 🪐",
                        title: `Mirror ${mirrors.indexOf(url) + 1} - ${s.quality}`,
                        url: s.url
                    }));
                }
            }
        } catch (e) {
            console.log(`Fallito mirror ${mirrors.indexOf(url) + 1}:`, e.message);
            continue; // Passa al prossimo mirror
        }
    }
    return []; // Se arriviamo qui, nessuno ha funzionato
}

module.exports = { getStreams };
