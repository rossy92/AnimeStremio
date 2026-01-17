const { serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest");
const animePahe = require("./providers/animepahe");
const animeKai = require("./providers/animekai");

builder.defineStreamHandler(async (args) => {
    const { id } = args;
    console.log(`Richiesta per ID: ${id}`);

    try {
        // Eseguiamo le ricerche in parallelo per essere veloci
        const [pahe, kai] = await Promise.all([
            animePahe.getStreams(id).catch(() => []),
            animeKai.getStreams(id).catch(() => [])
        ]);

        const streams = [...pahe, ...kai];

        if (streams.length === 0) {
            console.log("Nessun link trovato.");
        }

        return { 
            streams: streams,
            cacheMaxAge: 7200 // 2 ore di cache
        };
    } catch (e) {
        console.error(e);
        return { streams: [] };
    }
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: port });
console.log(`Server attivo sulla porta ${port}`);
