const { getStreamsForEpisode } = require("./providers/animepahe");

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    if (type !== "series") {
      return { streams: [] };
    }

    // id = anilist:ANILIST_ID:EPISODE
    const parts = id.split(":");
    if (parts.length !== 3) return { streams: [] };

    const anilistId = parts[1];
    const episode = parts[2];

    const streams = await getStreamsForEpisode(anilistId, episode);

    return { streams };

  } catch (err) {
    console.error("Stream error:", err);
    return { streams: [] };
  }
});
