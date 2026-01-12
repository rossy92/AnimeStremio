const { addonBuilder } = require("stremio-addon-sdk");
const animeworld = require("./providers/animeworld");

const manifest = {
    id: "org.animestremio.ita",
    version: "2.0.0", // Salto di versione per pulire la cache di Stremio
    name: "AnimeStremio ITA",
    description: "Sorgente Dinamica",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    // Estraiamo il titolo dall'ID. 
    // Se è kitsu:1, diventerà "Anime ID 1"
    const cleanTitle = args.id.replace(':', ' ').replace(':', ' ');
    
    console.log("Richiesta per:", cleanTitle);

    try {
        const streams = await animeworld.getStreams(cleanTitle);
        return { streams };
    } catch (err) {
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
