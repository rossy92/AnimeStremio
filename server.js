const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

// Questa riga permette a servizi come Koyeb o Render di assegnare
// automaticamente una porta. Se lo provi in locale, userà la 7000.
const port = process.env.PORT || 7000;

serveHTTP(addonInterface, { port: port });

console.log(`Addon attivo su: http://localhost:${port}/manifest.json`);
