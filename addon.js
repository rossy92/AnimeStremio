const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.0.0",
    name: "AnimeStremio",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    console.log("Richiesta per:", args.id);
    return Promise.resolve({
        streams: [
            {
                name: "AnimeStremio",
                title: "DEBUG: Server Connesso!",
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    });
});

module.exports = builder.getInterface();
