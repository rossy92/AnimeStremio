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
    // Gestione CORS per Stremio
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    // Mostra il manifest sia sulla root che su /manifest.json
    if (req.url === "/manifest.json" || req.url === "/") {
        res.end(JSON.stringify(manifest));
    } 
    // Gestione delle richieste di streaming
    else if (req.url.includes("/stream/")) {
        const parts = req.url.split("/");
        // Estrae l'ID (es: kitsu:1376:1)
        const id = parts[parts.length - 1].replace(".json", "");
        
        console.log("Richiesta ricevuta per ID:", id);
        
        try {
            // Per ora usiamo un titolo di test "Death Note" 
            // per confermare che i tasti appaiano
            const title = "Death Note"; 
            
            const [ita, eng] = await Promise.allSettled([
                anikai.getStreams(title),
                gogoanime.getStreams(title)
            ]);

            const streams = [];
            if (ita.status === "fulfilled" && Array.isArray(ita.value)) streams.push(...ita.value);
            if (eng.status === "fulfilled" && Array.isArray(eng.value)) streams.push(...eng.value);

            res.end(JSON.stringify({ streams: streams }));
        } catch (e) {
            console.error("Errore recupero streams:", e.message);
            res.end(JSON.stringify({ streams: [] }));
        }
    } 
    // Risposta per qualsiasi altra rotta
    else {
        res.end(JSON.stringify({ message: "Anikai Addon Online" }));
    }
});

// Porta 8000 specifica per Koyeb
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server Anikai attivo sulla porta ${PORT}`);
});
