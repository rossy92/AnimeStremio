const { serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest");

// Importiamo la logica di ricerca (Assicurati che il file esista in /providers)
const animePahe = require("./providers/animepahe");

builder.defineStreamHandler(async (args) => {
    const { type, id } = args;
    console.log(`Richiesta stream per: ${id}`);

    if (type === "series" || type === "movie") {
        try {
            // Cerchiamo i link usando la funzione definita in animepahe.js
            const streams = await animePahe.getStreams(id);
            return { streams: streams || [] };
        } catch (error) {
            console.error("Errore nel recupero degli stream:", error);
            return { streams: [] };
        }
    }

    return { streams: [] };
});

// Configurazione Porta fondamentale per Render
const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port: port });

console.log(`Addon HTTP pronto su porta: ${port}`);
