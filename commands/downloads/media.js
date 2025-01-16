const fetch = require('node-fetch');

const Func = async (url, platform) => {
  if (!url) {
    throw new Error('A video or content URL is required');
  }

  let _api;
  if (platform === 'facebook') {
    _api = `https://api.yanzbotz.live/api/downloader/facebook?url=${url}&apiKey=jawa`;
  } else if (platform === 'instagram') {
    _api = `https://api.yanzbotz.live/api/downloader/instagram?url=${url}&apiKey=jawa`;
  } else {
    throw new Error('Use "facebook","instagram"');}
  const response = await fetch(_api);
  const data = await response.json();
  if (data.status !== 200 || !data.result) {
    throw new Error(`err ${platform}`);}
  if (platform === 'facebook') {
    const { desc, thumb, video_hd, video_sd } = data.result;
    return {
      platform,
      description: desc || 'Facebook Video',
      thumbnail: thumb,
      videoHD: video_hd,
      videoSD: video_sd,
    };
  }

  if (platform === 'instagram') {
    const { type, thumbnail, url } = data.result[0];
    return {
      platform,
      type, 
      thumbnail,
      mediaUrl: url, 
    };
  }
};

module.exports = { Func };
