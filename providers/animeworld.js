const axios = require("axios");
async function getStreams(title) {
    try {
        const searchUrl = `https://www.animeworld.so/api/search?keyword=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl, { timeout: 5000 });
        if (data.animes && data.animes.length > 0) {
            return [{
                name: "AnimeWorld",
                title: `🎬 ${data.animes[0].name}`,
                url: `https://www.animeworld.so/play/${data.animes[0].link}`
            }];
        }
        return [];
    } catch (e) { return []; }
}
module.exports = { getStreams };
