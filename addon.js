const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.0.0",
    name: "AnimeStremio",
    description: "Addon per anime in italiano",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

// --- QUESTA È LA PARTE CHE CERCA I VIDEO (Assicurati che ci sia!) ---
builder.defineStreamHandler((args) => {
    // Qui andrebbe la logica per cercare i link (es. su Consumet o altri siti)
    // Per ora lo lasciamo così per vedere se il server si accende
    return Promise.resolve({ streams: [] });
});

// --- RIGA FINALE ---
module.exports = builder.getInterface();
