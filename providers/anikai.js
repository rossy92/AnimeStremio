const axios = require("axios");
const cheerio = require("cheerio");

async function getAnikaiStreams(title) {
    try {
        console.log("Ricerca su AniKai per:", title);
        
        // 1. Cerchiamo l'anime
        const searchUrl = `https://anikai.to/search?q=${encodeURIComponent(title)}`;
        const { data: searchData } = await axios.get(searchUrl, { 
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        
        const $search = cheerio.load(searchData);
        // Cerchiamo il link del primo risultato
        const animeLink = $search('a.anime-card, .result-item a').first().attr('href');

        if (!animeLink) {
            console.log("Nessun risultato trovato per:", title);
            return [];
        }

        // Se il link è relativo (es. /anime/one-piece), aggiungiamo la base
        const fullLink = animeLink.startsWith('http') ? animeLink : `https://anikai.to${animeLink}`;

        // 2. Entriamo nella pagina dell'anime
        const { data: animeData } = await axios.get(fullLink, { timeout: 5000 });
        const $anime = cheerio.load(animeData);
        
        const results = [];
        
        // 3. Cerchiamo i link degli episodi (i bottoni di streaming)
        // Adattato per i selettori comuni di AniKai
        $anime('a[href*="vidsrc"], a[href*="embed"], .btn-stream, .episode-link').each((i, el) => {
            const url = $anime(el).attr('href');
            const epText = $anime(el).text().trim() || `Episodio ${i + 1}`;
            
            if (url) {
                results.push({
                    name: "AniKai",
                    title: `Episodio: ${epText}`,
                    url: url
                });
            }
        });

        return results;
    } catch (e) {
        console.log("Errore durante l'estrazione da AniKai:", e.message);
        return [];
    }
}

module.exports = { getAnikaiStreams };
