const axios = require("axios");

async function getTitleFromId(id) {
    try {
        const parts = id.split(':');
        const mainId = parts[0];

        // Se è un ID IMDb (tt...), chiediamo a Cinemeta il titolo
        if (mainId.startsWith('tt')) {
            const meta = await axios.get(`https://v3-cinemeta.strem.io/meta/series/${mainId}.json`);
            return meta.data.meta.name;
        } 
        
        // Se è un ID Kitsu, usiamo l'API di Kitsu
        if (mainId.startsWith('kitsu')) {
            const kitsuId = mainId.split(':')[1];
            const meta = await axios.get(`https://kitsu.io/api/edge/anime/${kitsuId}`);
            return meta.data.data.attributes.canonicalTitle;
        }

        return mainId;
    } catch (e) {
        console.error("Errore nel mapping ID -> Titolo:", e.message);
        return null;
    }
}

module.exports = { getTitleFromId };
