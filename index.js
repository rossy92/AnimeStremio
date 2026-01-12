const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const anikai = require("./providers/anikai");
const gogo = require("./providers/gogoanime"); // Nuovo

const builder = new addonBuilder({
    id: "org.anikai.plus.final",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "Anime ITA/ENG",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"],
    catalogs: []
});

async function getTitleFromId(id) {
    try {
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            return res.data.data.attributes.canonicalTitle;
        }
        if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0];
            const res = await axios.get(`https://v3-cinemeta.strem.io/meta/series/${imdbId}.json`);
            return res.data.meta.name;
        }
        return id;
    } catch (e) { return id; }
}

builder.defineStreamHandler(async (args) => {
    const title = await getTitleFromId(args.id);
    console.log(`--- Ricerca per: ${title} ---`);

    // Eseguiamo entrambe le ricerche insieme
    const [itaResults, engResults] = await Promise.all([
        anikai.getStreams(title),
        gogo.getStreams(title)
    ]);

    return { streams: [...itaResults, ...engResults] };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
