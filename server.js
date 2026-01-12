const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

const port = process.env.PORT || 8000;

serveHTTP(addonInterface, { 
    port: port,
    hostname: "0.0.0.0"
});

console.log(`Server attivo sulla porta ${port}`);
