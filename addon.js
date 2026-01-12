const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.test",
    version: "1.0.0",
    name: "AnimeStremio Test",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    return Promise.resolve({
        streams: [
            {
                name: "Test",
                title: "Server Connesso!",
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ]
    });
});

module.exports = builder.getInterface();
