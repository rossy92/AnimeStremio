const { addonBuilder } = require("stremio-addon-sdk");
const animeworld = require("./providers/animeworld");
// Per ora commentiamo Saturn per isolare il problema
// const animesaturn = require("./providers/animesaturn");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.9.0",
    name: "AnimeStremio ITA",
    description: "Multi-fonte provvisorio",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    // Proviamo a estrarre un titolo verosimile dall'ID
    // Se è un anime (kitsu:123), cercheremo quello, altrimenti One Piece di default
    let query = "One Piece"; 
    if (args.id.includes("kitsu")) query = "Naruto"; // Test alternativo

    console.log("Richiesta per query:", query);

    try {
        const streams = await animeworld.getStreams(query);
        
        if (streams.length > 0) {
            return { streams };
        }
    } catch (err) {
        console.error(err);
    }

    return { 
        streams: [{ 
            name: "Info", 
            title: "Provando a connettere AnimeWorld...", 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});

module.exports = builder.getInterface();
