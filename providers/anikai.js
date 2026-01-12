const axios = require("axios");

async function getStreams(title) {
    // Lista di mirror pronti all'uso
    const mirrors = [
        `https://api.consumet.org/anime/gogoanime/${encodeURIComponent(title)}`,
        `https://api.amvstr.me/api/v2/search?q=${encodeURIComponent(title)}`,
        `https://api.enime.moe/search/${encodeURIComponent(title)}`
    ];

    for (const url of mirrors) {
        try {
            console.log(`[Anikai] Testo sorgente: ${url}`);
            const res = await axios.get(url, { timeout: 8000 });
            
            const results = res.data.results || res.data;
            if (results && results.length > 0) {
                const anime = results[0];
                console.log(`✅ TROVATO su ${url}`);
                
                // Qui semplifichiamo al massimo per evitare altri 404
                // Restituiamo un link di ricerca diretta se non riusciamo a prendere i singoli episodi
                return [{
                    name: "Anikai Finder 🪐",
                    title: `Risultato trovato: ${anime.title}\nClicca per cercare sorgenti`,
                    url: "https://www.google.com/search?q=" + encodeURIComponent(title + " streaming ita")
                }];
            }
        } catch (e) {
            console.log(`❌ Sorgente fallita: ${url.split('/')[2]}`);
        }
    }

    // Se tutto fallisce, usiamo un trucco: restituiamo un link "universale"
    return [{
        name: "Anikai Backup 🚨",
        title: "Tutte le sorgenti pubbliche sono offline.\nProva a riavviare tra 5 minuti.",
        url: "https://vidsrc.me/embed/anime?anilist=" + title 
    }];
}

module.exports = { getStreams };
