const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.0.0",
    name: "AnimeStremio",
    description: "Addon Test",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta ricevuta per ID:", args.id);

    // Invece di chiamare AniKai (che per ora potrebbe bloccarsi),
    // diamo una risposta immediata per vedere se Stremio la visualizza
    return { 
        streams: [
            {
                name: "AnimeStremio",
                title: "DEBUG: Server OK - Clicca per Test Video",
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ] 
    };
});

module.exports = builder.getInterface();
