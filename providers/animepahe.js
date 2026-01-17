const axios = require("axios");

async function getStreamsForEpisode(anilistId, episode) {
  try {
    // AnimePahe API unofficial
    // Cerca anime per AniList ID e episodio
    const searchUrl = `https://animepahe.com/api?m=release&id=${anilistId}&episode=${episode}`;
    const res = await axios.get(searchUrl);
    const data = res.data;

    if (!data || !data.data || data.data.length === 0) {
      return [];
    }

    // Mappa gli stream
    const streams = data.data.map(item => ({
      title: item.title,
