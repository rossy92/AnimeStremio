const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const manifest = require("./manifest");

const builder = new addonBuilder(manifest);

// STREAM HANDLER minimo
const { getStreamsForEpisode: getPaheStreams } = require("./providers/animepahe");
const { getStreamsForEpisode: getKaiStreams } = require("./providers/animekai");

builder.defineStreamHandler(async ({ type, id }) => {
  if (type !== "series") return { streams: [] };

  try {
    const parts = id.split(":");
    if (parts.length !== 3) return { streams: [] };

    const anilistId = parts[1];
    const episode = parts[2];

    // solo array vuoti per test
    let streams = await getPaheStreams(anilistId, episode);
    if (streams.length > 0) return { streams };

    streams = await getKaiStreams(anilistId, episode);
    return { streams };
  } catch (err) {
    console.error("Stream error:", err);
    return { streams: [] };
  }
});

// ---- Porta obbligatoria per Render ----
const { serveHTTP } = require("stremio-addon-sdk");
const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port: port });
