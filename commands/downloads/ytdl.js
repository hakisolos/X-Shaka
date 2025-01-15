const axios = require('axios');
const formats = { audio: 1, video: 0 };
const audioQuality = { '320kbps': 0, '256kbps': 1, '128kbps': 4, '96kbps': 5 };
const videoQuality = { '144p': 144, '360p': 360, '480p': 480, '720p': 720, '1080p': 1080 };
const cnv = {
  getData: async (url) => {
    const data = JSON.stringify({ url });
    const config = {
      method: 'POST',
      url: 'https://cnvmp3.com/get_video_data.php',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Content-Type': 'application/json',
        'accept-language': 'id-ID',
        'referer': 'https://cnvmp3.com/',
        'origin': 'https://cnvmp3.com',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=4',
        'te': 'trailers',
      },
      data: data,
    };

    const api = await axios.request(config);
    return api.data;
  },
  convert: async (url, format, quality) => {
    const { title } = await cnv.getData(url);
    const formatValue = formats[format];
    const qualityValue = format === 'audio' ? audioQuality[quality] : videoQuality[quality];
    const data = JSON.stringify({
      url,
      quality: qualityValue,
      title,
      formatValue,
    });

    const config = {
      method: 'POST',
      url: 'https://cnvmp3.com/download_video.php',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Content-Type': 'application/json',
        'accept-language': 'id-ID',
        'referer': 'https://cnvmp3.com/',
        'origin': 'https://cnvmp3.com',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=4',
        'te': 'trailers',
      },
      data: data,
    };

    const api = await axios.request(config);
    return api.data;
  },
};

module.exports = cnv;
          
