const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// PROVIDER DISATTIVATI (Puoi riattivarli togliendo // se serviranno)
// const animeworld = require("./providers/animeworld");
// const animesaturn = require("./providers/animesaturn");

// QUI AGGIUNGEREMO I TUOI PROVIDER INGLESI
// const providerInglese = require("./providers/tuo-file-inglese");

const manifest = {
    id: "org.animestremio.ita",
    version: "2.2.0",
    name: "AnimeStremio MULTI",
    description: "Ricerca Multi-Sito (ITA/ENG)",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: [] 
};

const builder = new addonBuilder(manifest);

async function getNameFromId(id) {
    const cleanId = id.split(":")[0];
    try {
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const resp = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`, { timeout: 3000 });
            return resp.data.data.attributes.canonicalTitle;
        } else if (id.startsWith("tt")) {
            const types = ["series", "movie", "anime"];
            for (const type of types) {
                try {
                    const resp = await axios.get(`https://v3-cinemeta.strem.io/meta/${type}/${cleanId}.json`, { timeout: 2000 });
                    if (resp.data && resp.data.meta) return resp.data.meta.name;
                } catch (e) {}
            }
        }
    } catch (e) { console.log("Errore ID:", e.message); }
    return null;
}

builder.defineStreamHandler(async (args) => {
    const realTitle = await getNameFromId(args.id);
    const searchTitle = realTitle || "";

    if (!searchTitle) return { streams: [] };

    console.log("--- Nuova Ricerca ---");
    console.log("Titolo:", searchTitle);

    let allStreams = [];

    try {
        // Al momento non esegue ricerche perché i provider sono commentati.
        // Esempio futuro:
        // const engResults = await providerInglese.getStreams(searchTitle).catch(() => []);
        // allStreams = [...engResults];
    } catch (e) { 
        console.log("Errore ricerca:", e.message); 
    }

    if (allStreams.length > 0) return { streams: allStreams };

    return { 
        streams: [{ 
            name: "Info", 
            title: `In attesa di provider validi per: ${searchTitle}`, 
            url: "
