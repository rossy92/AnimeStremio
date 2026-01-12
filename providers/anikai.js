const axios = require("axios");

async function getStreams(title) {
    try {
        // ... qui ci sarà il tuo codice di ricerca ...
        // Assicurati che restituisca un array di oggetti tipo:
        // [{ name: "Anikai", title: "720p", url: "..." }]
        return results; 
    } catch (e) {
        console.error("Errore Anikai:", e.message);
        return [];
    }
}

module.exports = { getStreams }; // Fondamentale!
