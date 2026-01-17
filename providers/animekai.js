const axios = require("axios");
const cheerio = require("cheerio");

async function getStreamsForEpisode(anilistId, episode) {
  try {
    // AnimeKai URL base
    const url = `https://animekai.com/anime/${anilistId}/episode-${episode}`;

    // Fetch pagina
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // Estrai iframe / video source
    const iframeSrc = $("iframe").attr("src");
    if (!iframeSrc) return [];

    // Mappa stream
    return [
      {
        title: `Episode ${episode}`,
        url: iframeSrc,
        quality: "HD",
        subtitles: []
      }
    ];

  } catch (err) {
