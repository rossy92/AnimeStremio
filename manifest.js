const { serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest");

// Gestione degli stream
builder.defineStreamHandler(async (args) => {
    const { type, id } = args;
    console.log(`Richiesta stream per ID: ${id} di tipo: ${type}`);

    // NOTA: Qui dovresti chiamare la logica dei tuoi file in /providers.
    // Per ora restituiamo una lista vuota per assicurarci che il server sia stabile.
    return { streams: [] };
});

// Configurazione Porta per Render
const port = process.env.PORT || 7000;

// Avvio del server
serveHTTP(builder.getInterface(), { 
    port: port,
    cacheMaxAge: 3600 // Opzionale: cache di 1 ora
});

console.log(`Addon pronto su: http://localhost:${port}/manifest.json`);
