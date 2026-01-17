const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    "id": "org.animestremio.rossy92",
    "version": "1.0.0",
    "name": "AnimeStremio (Eng Dub)",
    "description": "Watch English dubbed anime from AnimePahe and AnimeKai",
    "resources": ["stream"],
    "types": ["series", "movie"],
    "idPrefixes": ["tt", "kitsu"],
    "catalogs": []
};

const builder = new addonBuilder(manifest);

module.exports = builder;
