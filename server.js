const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

// Koyeb imposta la porta automaticamente, ma noi usiamo 8000 come base
const port = process.env.PORT || 8000;

// Forza l'ascolto su 0.0.0.0 (fondamentale per i servizi cloud)
serveHTTP(addonInterface, { 
    port: port, 
    hostname: "0.0.0.0" 
});

console.log(`Server pronto sulla porta ${port}`);
