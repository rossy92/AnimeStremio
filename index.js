const http = require("http");
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

const server = http.createServer(async (req, res) => {
    // Gestione CORS (per far parlare Stremio con il server)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === "/manifest.json") {
        res.end(JSON.stringify(manifest));
    } else if (req.url.includes("/stream/")) {
        const parts = req.url.split("/");
        const id = parts[parts.length - 1].replace(".json", "");
        
        console.log("Richiesta per ID:", id);
        
        try {
            // Cerchiamo solo su Anikai per ora per testare la stabilità
            const streams = await anikai.getStreams("Death Note");
            res.end(JSON.stringify({ streams: streams || [] }));
        } catch (e) {
            res.end(JSON.stringify({ streams: [] }));
        }
    } else {
        res.end(JSON.stringify({ message: "Anikai Addon Online" }));
    }
});

// Porta 8000 per Koyeb
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
