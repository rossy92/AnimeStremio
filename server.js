const { serveHTTP } = require("stremio-addon-sdk");
const builder = require("./manifest"); // Assicurati che punti al tuo file manifest

// ... qui ci saranno i tuoi addon.defineStreamHandler ecc. ...

// QUESTA È LA PARTE DA CORREGGERE:
const port = process.env.PORT || 7000; 

serveHTTP(builder.getInterface(), { port: port });
