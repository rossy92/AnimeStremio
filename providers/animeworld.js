async function getStreams(title) {
    // Risposta istantanea senza chiamate esterne per testare la connessione
    console.log("Ricevuta richiesta per:", title);
    
    return [{
        name: "AnimeWorld",
        title: `🎬 Link trovato per: ${title}`,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }];
}

module.exports = { getStreams };
