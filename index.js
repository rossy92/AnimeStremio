const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const anikai = require("./providers/anikai");

const builder = new addonBuilder({
    id: "org.anikai.plus.new", // Cambiato ID per forzare Stremio a vederlo come nuovo
    name: "Anikai Plus",
    version: "1.0.0",
    description: "AnimeWorld + Global Sources",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"],
    catalogs: []
});

// Traduzione ID -> Titolo
async function getTitleFromId(id) {
    try {
        // Se clicchi da un catalogo Anime (Kitsu)
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            return res.data.data.attributes.canonicalTitle;
        }
        
        // Se clicchi dal catalogo Generale (IMDb/TMDB)
        if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0]; // Toglie eventuali :1:1 finali
            const res = await axios.get(`https://v3-cinemeta.strem.io/meta/series/${imdbId}.json`);
            return res.data.meta.name;
        }
        
        return id;
    } catch (e) {
        console.log("Errore traduzione ID:", e.message);
        return id;
    }
}
builder.defineStreamHandler(async (args) => {
    console.log(`--- Richiesta per ID: ${args.id} ---`);
    const title = await getTitleFromId(args.id);
    
    try {
        const streams = await anikai.getStreams(title);
        // Restituiamo sempre un array, anche se vuoto
        return { streams: streams || [] };
    } catch (e) {
        console.log("Errore provider:", e.message);
        return { streams: [] };
    }
});

// Avvio Server
const addonInterface = builder.getInterface();
serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
