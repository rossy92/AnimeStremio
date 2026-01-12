const axios = require("axios");

async function getStreams(title) {
    try {
        const searchUrl = `https://www.animeworld.so/api/search?keyword=${encodeURIComponent(title)}`;
        const response = await axios.get(searchUrl, { timeout: 5000 });

        if (response.data && response.data.animes && response.data.animes.length > 0) {
            const anime = response.data.animes[0];
            return [{
                name: "AnimeWorld",
                title: `🎬 ${anime.name}`,
                url: `https://www.animeworld.so/play/${anime.link}`
            }];
        }
        return [];
    } catch (e) { return []; }
}
module.exports = { getStreams };
