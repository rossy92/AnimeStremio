module.exports = {
  id: "animestremio",
  version: "1.0.0",
  name: "AnimeStremio",
  description: "Stremio addon for English dubbed anime",
  types: ["series"],
  catalogs: [],           // <-- deve essere un array, anche vuoto
  resources: ["stream"],  // solo stream per ora
  idPrefixes: ["anilist:"]
};
