const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const manifest = require("./manifest");

const builder = new addonBuilder(manifest);

// STREAM HANDLER
builder.defineStreamHandler(async ({ type, id }) => {
  try {
    if (type !== "series") {
      return { streams: [] };
    }

    // Per ora: nessuno stream
    // (così NON appare il coniglio grasso)
    return { streams: [] };

  } catch (err) {
    console.error("Stream error:", err);
    return { streams: [] };
  }
});

const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });

console.log("AnimeStremio addon running on port", PORT);
