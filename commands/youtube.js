const { CreatePlug } = require('../lib/commands');
const YouTube = require('youtube-sr').default;
const tiktokdl = require('./downloads/tiktokdl'); 

CreatePlug({
  command: 'yts',
  category: 'search',
  desc: 'Search YouTube',
  execute: async (message, conn, argi) => {
    if (!argi) return message.reply('_Example: yts funny cat videos_');
    const results = await YouTube.search(argi, { limit: 19 });
    if (!results || results.length === 0) return message.reply('Not_found');
    let res = '*YouTube Search:*\n\n';
    for (let i = 0; i < results.length; i++) {
      const video = results[i];
      res += `${i + 1}. *${video.title}*\nDuration: ${video.durationFormatted}\nViews: ${video.views.toLocaleString()}\n${video.url}\n\n`;}
    await conn.sendMessage(message.user, { text: res.trim() }, { quoted: message });
  },
});
        
CreatePlug({
  command: 'tiktok',
  category: 'download',
  desc: 'Download TikTok videos',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a TikTok URL_');
    const videos = await tiktokdl(match).catch(error => message.reply(`${error}`));
    if (videos) await conn.sendMessage(message.user, { video: { url: videos.hdVideoUrl }, caption: `*Title:* ${videos.title}\n *Music*: ${videos.musicAuthor}`, }).catch(error => message.reply(`${error}`));
  },
});
