const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// 1. IMPORTAZIONE DEI PROVIDER
// Assicurati che i nomi dei file nella cartella /providers siano esattamente questi
const anikai = require("./providers/anikai");
const animegg = require("./providers/animegg");
const animeunity = require("./providers/animeunity");
const consumet = require("./providers/consumet");
const italiani = require("./providers/italiani"); // Questo contiene sia AnimeWorld che Saturn

const builder = new addonBuilder({
    id: "org.stremio.itamegapack",
    name: "Anime MegaPack ITA",
    description: "Streaming da AniKai, AnimeWorld, Saturn, Unity, Pahe e altri",
    resources: ["stream"],
    types: ["series", "movie"],
    idPrefixes: ["tt"] // Accetta ID IMDb
});

// 2. IL TRADUTTORE (PUNTO 3)
// Converte l'ID tt0409591 in "Naruto"
async function getTitleFromImdb(imdbId) {
    try {
        const resp = await axios.get(`https://kitsu.io/api/edge/anime?filter[imdbId]=${imdbId}`, { timeout: 3000 });
        if (resp.data && resp.data.data.length > 0) {
            return resp.data.data[0].attributes.canonicalTitle;
        }
    } catch (e) {
        console.error("Errore Kitsu mapping:", e.message);
    }
    return null;
}

// 3. IL GESTORE DELLE RICHIESTE
builder.defineStreamHandler(async (args) => {
    const title = await getTitleFromImdb(args.id);
    
    if (!title) {
        console.log("Titolo non trovato per ID:", args.id);
        return { streams: [] };
    }

    console.log(`Ricerca avviata per: ${title}`);

    // Lanciamo tutte le ricerche in parallelo per non far aspettare Stremio
    const tasks = [
        anikai.getAnikaiStreams(title),
        italiani.getAnimeWorld(title),
        italiani.getAnimeSaturn(title),
        animegg.getAnimeGGStreams(title),
        animeunity.getAnimeUnityStreams(title),
        consumet.getConsumetStreams(title)
    ];

    // Aspettiamo che tutti finiscano (o falliscano)
    const results = await Promise.allSettled(tasks);

    // Uniamo i risultati di tutti i siti in un unico array
    const allStreams = results
        .filter(r => r.status === 'fulfilled') // Prendiamo solo quelli che non hanno dato errore
        .flatMap(r => r.value);               // Uniamo le liste di link

    console.log(`Trovati ${allStreams.length} link per ${title}`);

    return { streams: allStreams };
});

module.exports = builder.getInterface();
