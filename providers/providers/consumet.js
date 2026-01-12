const { ANIME } = require("@consumet/extensions");

async function getConsumetStreams(title) {
    const providers = [
        new ANIME.AnimePahe(),
        new ANIME.NineAnime(),
        new ANIME.HiAnime()
    ];

    const allStreams = [];
    for (const provider of providers) {
        try {
            const search = await provider.search(title);
            if (search.results.length > 0) {
                const info = await provider.fetchAnimeInfo(search.results[0].id);
                // Prende l'ultimo episodio disponibile
                const epId = info.episodes[info.episodes.length - 1].id;
                const sources = await provider.fetchEpisodeSources(epId);
                
                sources.sources.forEach(s => {
                    allStreams.push({
                        name: provider.name,
                        title: `Sub/Dub - ${s.quality}`,
                        url: s.url
                    });
                });
            }
        } catch (e) { console.log(`Errore su ${provider.name}`); }
    }
    return allStreams;
}

module.exports = { getConsumetStreams };
