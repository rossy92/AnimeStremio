const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.0.1", // Ho cambiato versione per forzare l'aggiornamento
    name: "AnimeStremio",
    description: "Addon Test",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    console.log("Richiesta ricevuta per:", args.id);

    return Promise.resolve({
        streams: [
            {
                name: "✅ FUNZIONA",
                title: "Server OK - Clicca qui",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    });
});

module.exports = builder.getInterface();
