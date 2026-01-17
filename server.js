const { getStreamsForEpisode: getPaheStreams } = require("./providers/animepahe");
const { getStreamsForEpisode: getKaiStreams } = require("./providers/animekai");

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    if (type !== "series") return { streams: [] };

    // id = anilist:ANILIST_ID:EPISODE
    const parts = id.split(":");
    if (parts.length !== 3) return { streams: [] };

    const anilistId = parts[1];
    const episode = parts[2];

    // Prova AnimePahe prima
    let streams = await getPaheStreams(anilistId, episode);
    if (streams.length > 0) return { streams };

    // Fallback su AnimeKai
    streams = await getKaiStreams(anilistId, episode);
    return { streams };

  } catch (err) {
    console.error("Stream error:", err);
    return { streams: [] };
  }
});
