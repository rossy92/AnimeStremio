const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    "id": "org.pahekai.rossy92",
    "version": "1.0.0",
    "name": "PaheKai (Eng Dub)",
    "description": "Streams from AnimePahe & AnimeKai",
    "resources": ["stream"],
    "types": ["series", "movie"],
    "idPrefixes": ["tt", "kitsu"],
    "catalogs": []
};

const builder = new addonBuilder(manifest);

module.exports = builder;
