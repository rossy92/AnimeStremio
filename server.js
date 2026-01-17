const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest");

// --- GESTIONE DEGLI STREAM ---
// Questa funzione intercetta la richiesta di Stremio quando un utente clicca su un episodio
builder.defineStreamHandler(async (args) => {
    const { type, id } = args;

    // Log per il debug su Render (lo vedrai nei log della dashboard)
    console.log("Richiesta stream per:", type, id);

    if (type === "series" || type === "movie") {
        try {
            // Qui l'addon cerca i link nei tuoi provider (AnimePahe / AnimeKai)
            // Nota: sto assumendo che i tuoi file in /providers esportino funzioni di ricerca
            // Se i nomi dei file o delle funzioni sono diversi, dovrai adattarli.
            
            // Esempio generico di risposta (sostituisci con la logica dei tuoi provider):
            return { streams: [] }; 
            
        } catch (error) {
            console.error("Errore durante il recupero dello stream:", error);
            return { streams: [] };
        }
    }

    return { streams: [] };
});

// --- AVVIO DEL SERVER (Configurazione per Render) ---
// Render assegna automaticamente una porta tramite process.env.PORT.
// Se non la trova (es. in locale), usa la 7000.
const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port: port });

console.log(`Addon online su http://localhost:${port}/manifest.json`);
module.exports = builder;
