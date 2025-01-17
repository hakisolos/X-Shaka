const fetch = require('node-fetch');
const ytsr = require('yt-search');

/**
 * @param {string} query - The search query to find the YouTube video
 * @returns {Promise<Object>} - An object containing video details and download links
 */
async function Ytdl(query) {
  try {
    const voidi = await ytsr(query);
    if (!voidi.videos.length) {
      throw new Error('No videos found for the query');
    }
    const video = voidi.videos[0];
    const negro = video.url;
    const _api = `https://bk9.fun/download/youtube?url=${negro}`;
    const res = await fetch(_api);
    if (!res.ok) {
    throw new Error(`${res.status}`);}
    const data = await res.json();
    if (!data || !data.status) {
    throw new Error('err');}
    const db = data.BK9;
    return {
      title: db.title,
      downloadLinks: db.BK8.map((item) => ({
        quality: db.quality || 'nknown',
        format: db.format || 'nknown',
        size: db.size || 'nknown',
        link: db.link,
      })),
    };
  } catch (error) {
    console.error(`${error.message}`);
    throw error;
  }
}

module.exports = { Ytdl };
