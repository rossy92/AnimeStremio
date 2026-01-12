const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const manifest = {
    id: "org.animestremio.ita",
    version: "1.1.0",
    name: "AnimeStremio",
    description: "Streaming Anime in Italiano",
    resources: ["stream"], 
    types: ["anime", "series"],
    idPrefixes: ["tt", "kitsu"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    console.log("Ricerca per ID:", args.id);

    // ESEMPIO DI RICERCA: 
    // Per ora, dato che è un test, cerchiamo sempre "One Piece" 
    // Appena vediamo che funziona, aggiungeremo la traduzione automatica dei titoli!
    const searchTitle = "One Piece"; 

    try {
        const searchUrl = `https://anikai.to/search?q=${encodeURIComponent(searchTitle)}`;
        const { data } = await axios.get(searchUrl, { timeout: 5000 });
        const $ = cheerio.load(data);
        
        const animeLink = $('.anime-card a').first().attr('href');
        if (!animeLink) return { streams: [] };

        const { data: animeData } = await axios.get(animeLink);
        const $anime = cheerio.load(animeData);
        
        const streams = [];
        $anime('a.btn-stream').each((i, el) => {
            const url = $(el).attr('href');
            if (url) {
                streams.push({
                    name: "AniKai",
                    title: `Episodio - ${$(el).text().trim()}`,
                    url: url
                });
            }
        });

        return { streams };
    } catch (err) {
        console.error("Errore ricerca:", err.message);
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
