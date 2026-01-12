const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// DEVONO ESSERCI ENTRAMBI QUI:
const animeworld = require("./providers/animeworld");
const animesaturn = require("./providers/animesaturn"); 

const manifest = {
    id: "org.animestremio.ita",
    version: "2.2.0",
    name: "AnimeStremio ITA",
    description: "Ricerca Multi-Sito",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

// ... (tieni la funzione getNameFromId come l'abbiamo scritta prima) ...

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);
    const realTitle = await getNameFromId(args.id);
    const searchTitle = realTitle || "";

    console.log("Titolo individuato:", searchTitle);

    if (!searchTitle) return { streams: [] };

    try {
        // Proviamo a interrogarli entrambi in contemporanea
        const [resultsAW, resultsSaturn] = await Promise.all([
            animeworld.getStreams(searchTitle).catch(() => []),
            animesaturn.getStreams(searchTitle).catch(() => [])
        ]);

        const allStreams = [...resultsAW, ...resultsSaturn];
        
        if (allStreams.length > 0) return { streams: allStreams };

    } catch (err) {
        console.error("Errore generale ricerca:", err);
    }

    return { 
        streams: [{ 
            name: "Info", 
            title: `Nessun risultato per: ${searchTitle}`, 
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        }] 
    };
});
