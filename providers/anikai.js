const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca su Mirror Secondario per:", title);
        
        // Proviamo un'istanza diversa (ne usiamo una che di solito è meno affollata)
        const baseUrl = "https://consumet-api-one.vercel.app/anime/gogoanime";
        
        const searchRes = await axios.get(`${baseUrl}/${encodeURIComponent(title)}`, { timeout: 8000 });
        const results = searchRes.data.results;

        if (!results || results.length === 0) {
            console.log("Nessun risultato trovato sul Mirror Secondario.");
            return [];
        }

        // Cerchiamo i link per il primo risultato
        const animeId = results[0].id;
        console.log("ID Trovato:", animeId);

        const infoRes = await axios.get(`${baseUrl}/info/${animeId}`);
        const episodes = infoRes.data.episodes;

        if (!episodes || episodes.length === 0) return [];

        // Prendiamo l'ultimo episodio (spesso è più facile da trovare rispetto al primo)
        const epId = episodes[episodes.length - 1].id;

        const watchRes = await axios.get(`${baseUrl}/watch/${epId}`);
        
        if (!watchRes.data || !watchRes.data.sources) return [];

        return watchRes.data.sources.map(s => ({
            name: "Anikai 🪐",
            title: `ENG - ${s.quality}\n${results[0].title}`,
            url: s.url,
            isM3U8: s.url.includes(".m3u8")
        }));

    } catch (e) {
        console.log("Errore Mirror Secondario:", e.message);
        return [];
    }
}

module.exports = { getStreams };
