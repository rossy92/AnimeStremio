const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const anikai = require("./providers/anikai");
const gogo = require("./providers/gogoanime");

const manifest = {
    id: "com.anikai.plus.final",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "Anime ITA/ENG",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);
    
    // Per ora restituiamo un array vuoto se fallisce, 
    // così Stremio non vede errori e l'addon resta attivo
    try {
        const title = "Death Note"; // Test rapido per vedere se carica
        const streams = await anikai.getStreams(title);
        return { streams: streams || [] };
    } catch (e) {
        return { streams: [] };
    }
});

const addonInterface = builder.getInterface();
serveHTTP(addonInterface, { port: process.env.PORT || 8080 });
