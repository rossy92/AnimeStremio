const axios = require("axios");

const PROXY_URL = "https://gay-toucan-newross-cd988fb6.koyeb.app";
const PASSWORD = "4Str3m10";

async function getStreams(title) {
    try {
        // Tentativo su rotta "nascosta" tipica di alcuni fork di UnHided
        const config = { headers: { "api_password": PASSWORD }, timeout: 5000 };
        
        console.log(`[Discovery] Verifico rotta base per: ${title}`);
        
        // Questo è il formato che molti fork usano quando nascondono i nomi dei provider
        const url = `${PROXY_URL}/v1/search?q=${encodeURIComponent(title)}`;
        const res = await axios.get(url, config);

        if (res.data && res.data.length > 0) {
            const anime = res.data[0];
            return [{
                name: "Anikai Private 🪐",
                title: `Trovato: ${anime.title}`,
                url: `${PROXY_URL}/v1/watch/${anime.id}?api_password=${PASSWORD}`
            }];
        }
    } catch (e) {
        console.log("❌ Rotta /v1/search non trovata.");
    }

    // Se fallisce, chiediamo al proxy "Cosa sai fare?"
    try {
        const openapi = await axios.get(`${PROXY_URL}/openapi.json`);
        const paths = Object.keys(openapi.data.paths).slice(0, 5); // Prende le prime 5 rotte
        console.log("🔍 Rotte disponibili sul tuo proxy:", paths.join(" | "));
    } catch (err) {
        console.log("Impossibile leggere la mappa del proxy.");
    }

    return [];
}

module.exports = { getStreams };
