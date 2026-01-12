const { addonBuilder } = require("stremio-addon-sdk");

// Importiamo i provider separati
const animeworld = require("./providers/animeworld");
const animesaturn = require("./providers/animesaturn");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.8.0",
    name: "AnimeStremio Multi",
    description: "Fonti Italiane Separate",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    const testTitle = "One Piece"; // Poi lo renderemo dinamico

    // Chiamiamo tutti i provider in contemporanea
    const results = await Promise.allSettled([
        animeworld.getStreams(testTitle),
        animesaturn.getStreams(testTitle)
    ]);

    // Uniamo i risultati di quelli che hanno risposto correttamente
    const allStreams = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

    return { 
        streams: allStreams.length > 0 ? allStreams : [{ 
            name: "Info", 
            title: "Nessun link trovato", 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});

module.exports = builder.getInterface();
