const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

const port = process.env.PORT || 8000;

serveHTTP(addonInterface, { port: port });

console.log(`Addon pronto sulla porta ${port}`);
