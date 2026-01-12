const axios = require('axios');

async function getAnimeUnityStreams(title) {
    try {
        // AnimeUnity spesso richiede header specifici per non bloccare la richiesta
        const searchUrl = `https://www.animeunity.so/api/search?name=${encodeURIComponent(title)}`;
        const response = await axios.get(searchUrl, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        const anime = response.data.animes[0];
        if (!anime) return [];

        return [{
            name: "AnimeUnity",
            title: `Episodio Recente - ITA`,
            url: `https://www.animeunity.so/anime/${anime.id}-${anime.slug}` 
        }];
    } catch (e) {
        return [];
    }
}

module.exports = { getAnimeUnityStreams };
