const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const anikai = require("./providers/anikai");
const gogoanime = require("./providers/gogoanime");

const manifest = {
    id: "com.anikai.plus.final",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "Anime ITA/ENG",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"]
};

const builder = new addonBuilder(manifest);

async function getTitleFromId(id) {
    try {
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`, { timeout: 3000 });
            return res.data.data.attributes.canonicalTitle;
        }
        if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0];
            const res = await axios.get(`https://v3-cinemeta.strem.io/meta/series/${imdbId}.json`, { timeout: 3000 });
            return res.data.meta.name;
        }
    } catch (e) {
        return null;
    }
    return null;
}

builder.defineStreamHandler(async (args) => {
    const title = await getTitleFromId(args.id);
    if (!title) return { streams: [] };

    console.log(`--- Ricerca per: ${title} ---`);

    try {
        const [ita, eng] = await Promise.allSettled([
            anikai.getStreams(title),
            gogoanime.getStreams(title)
        ]);

        const streams = [];
        if (ita.status === "fulfilled" && Array.isArray(ita.value)) streams.push(...ita.value);
        if (eng.status === "fulfilled" && Array.isArray(eng.value)) streams.push(...eng.value);

        return { streams: streams };
    } catch (e) {
        console.log("Errore stream handler:", e.message);
        return { streams: [] };
    }
});

const addonInterface = builder.getInterface();
// CONFIGURATA PORTA 8000 PER KOYEB
serveHTTP(addonInterface, { port: process.env.PORT || 8000 });
