const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.0.0",
    name: "AnimeStremio",
    description: "Addon per anime in italiano",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

// --- MOTORE DI RICERCA ---
builder.defineStreamHandler(async (args) => {
    // args.id contiene l'ID dell'anime, esempio "kitsu:1234:1"
    console.log("Richiesta per:", args.id);

    // Per ora creiamo un link di test per vedere se l'addon risponde
    // In futuro, qui inseriremo la ricerca automatica sui siti italiani
    const streams = [
        {
            title: "Test Stream (Funzionante!)",
            description: "Se vedi questo, l'addon comunica con Stremio",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }
    ];

    if (args.id) {
        return { streams: streams };
    } else {
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
