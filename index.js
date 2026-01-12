const http = require("http");
const axios = require("axios");
const hianime = require("./providers/hianime");

const manifest = {
    id: "com.anikai.plus.global",
    name: "Anikai Plus ENG",
    version: "1.1.0",
    description: "Anime in Inglese (Sub/Dub) - Alta Qualità",
    resources: ["stream"],
    types: ["anime", "series", "movie"],
    idPrefixes: ["kitsu", "tt"]
};

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
    } catch (e) { return null; }
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
        
        // Estraiamo l'episodio dall'ID (es: kitsu:11:5 -> episodio 5)
        const idParts = id.split(":");
        const episode = idParts.length > 2 ? idParts[2] : "1";
        
        const title = await getTitleFromId(id);
        console.log(`[Server] Ricerca: ${title} - Ep: ${episode}`);

        if (!title) return res.end(JSON.stringify({ streams: [] }));

        try {
            // Passiamo sia il titolo che l'episodio al provider
            const streams = await hianime.getStreams(title, episode);
            res.end(JSON.stringify({ streams: streams || [] }));
        } catch (e) {
            res.end(JSON.stringify({ streams: [] }));
        }
    }
});

server.listen(process.env.PORT || 8000);
