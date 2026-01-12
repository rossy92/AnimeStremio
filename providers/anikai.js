const axios = require("axios");

async function getStreams(title) {
    try {
        console.log("Ricerca su Sorgente Alternativa (Bypass) per:", title);
        
        // Usiamo un'istanza diversa che spesso rimane attiva quando le altre cadono
        const searchUrl = `https://anime-api.xyz/api/gogoanime/search?query=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl, { timeout: 8000 });

        if (!data || !data.results || data.results.length === 0) {
            console.log("Nessun risultato sulla sorgente alternativa.");
            return [];
        }

        const anime = data.results[0];
        console.log("Anime trovato:", anime.title);

        // Generiamo i link per i primi episodi
        // Questo server restituisce link diretti più facilmente
        const infoUrl = `https://anime-api.xyz/api/gogoanime/info/${anime.id}`;
        const info = await axios.get(infoUrl);

        if (!info.data || !info.data.episodes) return [];

        const firstEp = info.data.episodes[0];
        const streamUrl = `https://anime-api.xyz/api/gogoanime/watch/${firstEp.id}`;
        const { data: streams } = await axios.get(streamUrl);

        return streams.sources.map(s => ({
            name: "Anikai (Alt) 🪐",
            title: `ENG - ${s.quality}`,
            url: s.url
        }));

    } catch (e) {
        console.log("Errore Sorgente Alternativa:", e.message);
        return [];
    }
}

module.exports = { getStreams };
