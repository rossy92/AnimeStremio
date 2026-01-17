async function getStreamsForEpisode(anilistId, episode) {
  // flusso di test pubblico
  return [
    {
      title: "Test Episode",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // video pubblico per test
      season: 1,
      episode: parseInt(episode),
      subtitles: []
    }
  ];
}

module.exports = { getStreamsForEpisode };
