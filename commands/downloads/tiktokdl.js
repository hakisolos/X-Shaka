var fetch = require('node-fetch');

const tiktokdl = async (url) => {
  const api = `https://diegoson-naxor-api.hf.space/tiktok?url=${url}`;
  try {
    const res = await fetch(api);
    if (!res.ok) {
      throw new Error('err');}
    const data = await res.json();
    if (data.status === 200) {
      const videoData = data.data;
      return {
        title: videoData.title,
        videoUrl: videoData.playUrl,
        hdVideoUrl: videoData.hdPlayUrl,
        musicTitle: videoData.musicTitle,
        musicAuthor: videoData.musicAuthor,
        playCount: videoData.playCount,
        avatar: videoData.avatar,
      };
    } else {
      throw new Error('Invalid');
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = tiktokdl;
