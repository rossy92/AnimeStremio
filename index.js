const { addonBuilder } = require("stremio-addon-sdk");
const anikai = require("./providers/anikai");

const builder = new addonBuilder({
    id: "org.anikai.ita",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "Anime ITA/ENG da AnimeWorld e fonti Global",
    resources: ["stream"],
    types: ["anime", "movie", "series"],
    catalogs: []
});

builder.defineStreamHandler(async (args) => {
    // Cerchiamo il titolo tramite l'ID (Stremio passa metadati, dobbiamo estrarre il nome)
    // Per ora, per test, usiamo un titolo fisso o proviamo a intercettare il nome se disponibile
    const title = args.id; // Nota: Qui andrebbe una logica per convertire ID in Titolo, ma iniziamo a vedere se i link appaiono
    
    console.log(`--- Ricerca in corso per ID: ${args.id} ---`);
    const streams = await anikai.getStreams(title);
    
    return { streams: streams };
});

const addonInterface = builder.getInterface();
module.exports = addonInterface;

// Per farlo girare su Koyeb (Server HTTP)
const { serveHTTP } = require("stremio-addon-sdk");
serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
