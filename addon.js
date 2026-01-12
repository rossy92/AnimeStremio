const { addonBuilder } = require("stremio-addon-sdk");
const animesaturn = require("./providers/animesaturn");
const axios = require("axios");

const manifest = {
    id: "org.animestremio.ita",
    version: "2.2.0",
    name: "AnimeStremio ITA",
    description: "Ricerca Automatica Fix",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

async function getNameFromId(id) {
    try {
        // Se l'ID è di Kitsu (es. kitsu:1234)
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const resp = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`, { timeout: 3000 });
            return resp.data.data.attributes.canonicalTitle;
        } 
        // Se l'ID è di IMDb (es. tt0409591)
        else if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0];
            // Usiamo un servizio gratuito che converte IMDb in titoli senza API Key
            const resp = await axios.get(`https://v3-cinemeta.strem.io/meta/anime/${imdbId}.json`, { timeout: 3000 });
            return resp.data.meta.name;
        }
    } catch (e) {
        console.log("Errore conversione titolo:", e.message);
    }
    return null;
}

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);

    const realTitle = await getNameFromId(args.id);
    // Se non troviamo il titolo, proviamo a pulire l'ID come ultima spiaggia
    const searchTitle = realTitle || "";

    console.log("Titolo individuato:", searchTitle);

    try {
        // Cerchiamo su entrambi
        const [awResults, saturnResults] = await Promise.all([
            animeworld.getStreams(searchTitle),
            animesaturn.getStreams(searchTitle)
        ]);
        
        const allStreams = [...awResults, ...saturnResults];
        if (allStreams.length > 0) return { streams: allStreams };
    } catch (err) {
        console.error("Errore:", err);
    }

    return { 
        streams: [{ 
            name: "Info", 
            title: `Nessun risultato per: ${searchTitle}`, 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});

module.exports = builder.getInterface();
