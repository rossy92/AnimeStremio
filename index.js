const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const anikai = require("./providers/anikai");

const builder = new addonBuilder({
    id: "org.anikai.plus",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "AnimeWorld + Global Sources",
    resources: ["stream"],
    types: ["anime", "movie", "series"],
    catalogs: []
});

// Funzione per convertire ID Kitsu in Titolo Reale
async function getTitleFromId(id) {
    try {
        if (id.startsWith("kitsu:")) {
            // Rimuove l'ID dell'episodio se presente (es: kitsu:1376:1 -> 1376)
            const kitsuId = id.split(":")[1];
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            return res.data.data.attributes.canonicalTitle;
        }
        return id;
    } catch (e) {
        console.log("Errore recupero titolo:", e.message);
        return id;
    }
}

builder.defineStreamHandler(async (args) => {
    console.log(`--- Richiesta Stream per ID: ${args.id} ---`);
    
    // 1. Otteniamo il nome dell'anime dall'ID
    const title = await getTitleFromId(args.id);
    console.log(`Titolo identificato: ${title}`);

    // 2. Chiediamo i link al provider
    const streams = await anikai.getStreams(title);
    
    return { streams: streams };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
