const { serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest");

// Importiamo i due provider
const animePahe = require("./providers/animepahe");
const animeKai = require("./providers/animekai");

builder.defineStreamHandler(async (args) => {
    const { id } = args;
    
    // Proviamo a prendere gli stream da entrambi contemporaneamente
    try {
        const [paheStreams, kaiStreams] = await Promise.all([
            animePahe.getStreams(id),
            animeKai.getStreams(id)
        ]);

        // Uniamo i risultati
        const allStreams = [...paheStreams, ...kaiStreams];

        return { 
            streams: allStreams,
            cacheMaxAge: 14400 // Cache di 4 ore
        };
    } catch (e) {
        return { streams: [] };
    }
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: port });
