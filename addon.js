const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// Per ora non importiamo nulla, lasciamo i file nella cartella providers
// e li richiameremo appena siamo pronti.

const manifest = {
    id: "org.animestremio.ita",
    version: "2.2.0",
    name: "AnimeStremio MULTI",
    description: "In attesa di configurazione provider",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: [] // Deve essere un array vuoto
};

const builder = new addonBuilder(manifest);

// Funzione di servizio per ottenere il nome dall'ID
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
    const searchTitle = await getNameFromId(args.id) || "Anime";
    console.log("Ricerca ricevuta per:", searchTitle);

    // Qui restituiremo un link di test fisso per essere sicuri che il deploy FUNZIONI
    // Se vedi questo link su Stremio, il deploy è ufficialmente guarito.
    return Promise.resolve({
        streams: [{
            name: "SISTEMA OK",
            title: `Pronto per provider inglesi: ${searchTitle}`,
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }]
    });
});

module.exports = builder.getInterface();
