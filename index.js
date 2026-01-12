const http = require("http");
const axios = require("axios");
const hianime = require("./providers/hianime");

const manifest = {
    id: "com.anikai.plus.vidsrc",
    name: "Anikai Plus (Direct)",
    version: "2.1.0",
    description: "Streaming Direct (No Torrent)",
    resources: ["stream"],
    types: ["anime", "series"],
    idPrefixes: ["kitsu", "tt"]
};

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === "/manifest.json" || req.url === "/") {
        return res.end(JSON.stringify(manifest));
    }

    if (req.url.includes("/stream/")) {
        try {
            const parts = req.url.split("/");
            const id = decodeURIComponent(parts[parts.length - 1].replace(".json", ""));
            const idParts = id.split(":");
            const episode = idParts[2] || "1";

            // Recupero titolo da Kitsu
            const kitsuId = idParts[1];
            const kitsuRes = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            const title = kitsuRes.data.data.attributes.canonicalTitle;

            const streams = await hianime.getStreams(title, episode);
            res.end(JSON.stringify({ streams: streams || [] }));
        } catch (e) {
            res.end(JSON.stringify({ streams: [] }));
        }
    } else {
        res.end(JSON.stringify({ status: "online" }));
    }
});

server.listen(process.env.PORT || 8000);
