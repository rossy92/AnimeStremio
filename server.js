const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon"); // Il file che abbiamo visto prima

serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
