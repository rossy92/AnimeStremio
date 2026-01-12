const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// 1. IMPORTA ANIKAI
const anikai = require("./providers/anikai");

const manifest = {
    id: "org.animestremio.ita",
    version: "2.2.0",
    name: "AnimeStremio MULTI",
    description: "Anikai Eng Provider",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

async function getNameFromId(id) {
    try {
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const resp = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`, { timeout: 3000 });
            return resp.data.data.attributes.canonicalTitle;
        } else if (id.startsWith("tt")) {
            const resp = await axios.get(`https://v3-cinemeta.strem.io/meta/anime/${id.split(":")[0]}.json`, { timeout: 2000 });
            return resp.data && resp.data.meta ? resp.data.meta.name : null;
        }
    } catch (e) { return null; }
    return null;
}

builder.defineStreamHandler(async (args) => {
    const searchTitle = await getNameFromId(args.id);
    if (!searchTitle) return { streams: [] };

    console.log("--- Ricerca in corso ---");
    console.log("Titolo:", searchTitle);

    try {
        // QUESTA È LA RIGA GIUSTA:
        const streams = await anikai.getStreams(searchTitle);
        
        if (streams && streams.length > 0) {
            console.log(`Trovati ${streams.length} link su Anikai`);
            return { streams: streams };
        }
    } catch (e) {
        console.log("Errore chiamata Anikai:", e.message);
    }

    // Se non trova nulla, mostra questo:
    return { 
        streams: [{ 
            name: "Info", 
            title: `Nessun link su Anikai per: ${searchTitle}`, 
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});

module.exports = builder.getInterface();
