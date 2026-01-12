const http = require("http");
const axios = require("axios");
const anikai = require("./providers/anikai");

const manifest = {
    id: "com.anikai.plus.final",
    name: "Anikai Plus",
    version: "1.0.0",
    description: "Anime ITA - AnimeWorld",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"]
};

async function getTitleFromId(id) {
    try {
        // Se l'ID viene da Kitsu (standard per gli anime su Stremio)
        if (id.startsWith("kitsu:")) {
            const kitsuId = id.split(":")[1];
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`, { timeout: 3000 });
            return res.data.data.attributes.canonicalTitle;
        }
        // Se l'ID viene da IMDb (tt...)
        if (id.startsWith("tt")) {
            const imdbId = id.split(":")[0];
            const res = await axios.get(`https://v3-cinemeta.strem.io/meta/series/${imdbId}.json`, { timeout: 3000 });
            return res.data.meta.name;
        }
    } catch (e) {
        console.log("Errore nel recupero del titolo:", e.message);
    }
    return null;
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === "/manifest.json" || req.url === "/") {
        res.end(JSON.stringify(manifest));
    } 
    else if (req.url.includes("/stream/")) {
        const parts = req.url.split("/");
        const id = decodeURIComponent(parts[parts.length - 1].replace(".json", ""));
        
        // RECUPERO TITOLO REALE
        const title = await getTitleFromId(id);
        console.log(`--- Ricerca per: ${title} (ID: ${id}) ---`);

        if (!title) {
            return res.end(JSON.stringify({ streams: [] }));
        }

        try {
            // Cerchiamo solo su Anikai (AnimeWorld)
            const results = await anikai.getStreams(title);
            res.end(JSON.stringify({ streams: results || [] }));
        } catch (e) {
            res.end(JSON.stringify({ streams: [] }));
        }
    } 
    else {
        res.end(JSON.stringify({ message: "Anikai Online" }));
    }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
