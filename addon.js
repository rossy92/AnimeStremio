const { addonBuilder } = require("stremio-addon-sdk");
// Importiamo dal tuo file nella cartella providers
const { getAnikaiStreams } = require("./providers/anikai");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.5.0",
    name: "AnimeStremio ITA",
    description: "Fonti: AniKai",
    resources: ["stream"], 
    types: ["anime", "series", "movie"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    console.log("Richiesta per ID:", args.id);

    try {
        // Per ora facciamo un test cercando "One Piece" 
        // così vediamo se il tuo file anikai.js estrae correttamente i link
        const anikaiLinks = await getAnikaiStreams("One Piece");

        if (anikaiLinks && anikaiLinks.length > 0) {
            return { streams: anikaiLinks };
        } else {
            return { 
                streams: [{ 
                    name: "AniKai", 
                    title: "Nessun link trovato (Test One Piece)", 
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                }] 
            };
        }
    } catch (error) {
        console.error("Errore nel provider:", error);
        return { 
            streams: [{ 
                name: "Errore", 
                title: "Errore durante la ricerca", 
                url: "" 
            }] 
        };
    }
});

module.exports = builder.getInterface();
