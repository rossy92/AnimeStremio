const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.2.0", // Versione nuova per forzare Stremio a vederlo
    name: "AnimeStremio ITA",
    description: "Addon in fase di sviluppo",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    console.log("Richiesta ricevuta per:", args.id);

    // Risposta immediata per evitare che l'addon scompaia
    return Promise.resolve({
        streams: [
            {
                name: "AnimeStremio",
                title: "⚠️ SERVER ATTIVO - In attesa di configurazione",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    });
});

module.exports = builder.getInterface();
