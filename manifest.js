const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    "id": "org.animestremio.rossy",
    "version": "1.0.0",
    "name": "AnimeStremio",
    "resources": ["stream"],
    "types": ["series", "movie"],
    "idPrefixes": ["tt", "kitsu"] // tt per IMDb, kitsu per gli anime
};

const builder = new addonBuilder(manifest);

module.exports = builder;
