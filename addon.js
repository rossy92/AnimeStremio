const { addonBuilder } = require("stremio-addon-sdk");
const animeworld = require("./providers/animeworld");
const axios = require("axios");

const manifest = {
    id: "org.animestremio.ita",
    version: "2.1.0",
    name: "AnimeStremio ITA",
    description: "Ricerca Automatica Titoli",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

// Funzione per recuperare il nome dell'anime dall'ID
async function getNameFromId(id) {
    try {
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const resp = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            return resp.data.data.attributes.canonicalTitle;
        } else if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0];
            const resp = await axios.get(`https://api.themoviedb.org/3/find/${imdbId}?api_key=8d4f04c6e945c58b5a34c89018428f52&external_source=imdb_id`);
            if (resp.data.movie_results.length > 0) return resp.data.movie_results[0].title;
            if (resp.data.tv_results.length > 0) return resp.data.tv_results[0].name;
        }
    } catch (e) {
        console.log("Errore conversione titolo:", e.message);
    }
    return null;
}

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);

    // 1. Convertiamo l'ID in un titolo leggibile (es: tt0409591 -> Naruto)
    const realTitle = await getNameFromId(args.id);
    const searchTitle = realTitle || args.id;

    console.log("Titolo individuato:", searchTitle);

    try {
        // 2. Cerchiamo il titolo su AnimeWorld
        const streams = await animeworld.getStreams(searchTitle);
        
        if (streams && streams.length > 0) {
            return { streams };
        }
    } catch (err) {
        console.error(err);
    }

    return { 
        streams: [{ 
            name: "Info", 
            title: `Nessun risultato trovato per: ${searchTitle}`, 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});

module.exports = builder.getInterface();
