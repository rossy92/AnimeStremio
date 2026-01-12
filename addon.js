const axios = require('axios');

async function getTitleFromImdb(imdbId) {
    try {
        // Chiamata all'API di Kitsu per tradurre l'ID IMDb (es. tt0409591) in titolo (Naruto)
        const response = await axios.get(`https://kitsu.io/api/edge/anime?filter[imdbId]=${imdbId}`);
        
        if (response.data.data && response.data.data.length > 0) {
            // Prendiamo il titolo canonico (solitamente in inglese/romaji, il più usato dai siti)
            return response.data.data[0].attributes.canonicalTitle;
        }
        return null;
    } catch (error) {
        console.error("Errore nella traduzione ID -> Titolo:", error.message);
        return null;
    }
}
