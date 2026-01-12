const { addonBuilder } = require("stremio-addon-sdk");
// Carichiamo il file con il nome corretto
const providers = require("./providers/italiani"); 

const manifest = {
    id: "org.animestremio.ita",
    version: "1.7.5",
    name: "AnimeStremio ITA",
    description: "Fonti: AnimeWorld & Saturn",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);

    try {
        const testTitle = "One Piece";
        let allStreams = [];

        // 1. Proviamo AnimeWorld
        if (typeof providers.getAnimeWorldStreams === "function") {
            const aw = await providers.getAnimeWorldStreams(testTitle).catch(() => []);
            allStreams = allStreams.concat(aw);
        } else {
            console.log("Funzione getAnimeWorldStreams non trovata in italiani.js");
        }

        // 2. Proviamo AnimeSaturn
        if (typeof providers.getAnimeSaturnStreams === "function") {
            const saturn = await providers.getAnimeSaturnStreams(testTitle).catch(() => []);
            allStreams = allStreams.concat(saturn);
        } else {
            console.log("Funzione getAnimeSaturnStreams non trovata in italiani.js");
        }

        if (allStreams.length > 0) {
            return { streams: allStreams };
        } else {
            return { 
                streams: [{ 
                    name: "Info", 
                    title: "Nessun link trovato in italiani.js (Test One Piece)", 
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                }] 
            };
        }
    } catch (error) {
        console.error("Errore critico nell'addon:", error);
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
