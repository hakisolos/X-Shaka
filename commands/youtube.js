const { CreatePlug } = require('../lib/commands');
const { Func } = require('./downloads/media');
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
    await conn.sendMessage(message.user, { video: { url: videos.hdVideoUrl }, caption: `*Title:* ${videos.title}\n *Music*: ${videos.musicAuthor}\nMade with❣️`, }).catch(error => message.reply(`${error}`));
  },
});

CreatePlug({
  command: 'fb',
  category: 'download',
  desc: 'Download Facebook videos',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a Facebook video URL_');
    const result = await Func(match, 'facebook');
    if (result.platform === 'facebook' && result.videoHD) {
      await conn.sendMessage(message.user, {
        video: { url: result.videoHD },
        caption: `*Likes*: ${result.likes || 'ehe'}\n*Shares:* ${result.shares || 'N/A'}`,
      });
    } else {}
  },
});

CreatePlug({
  command: 'instagram',
  category: 'download',
  desc: 'Download Instagram videos',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide an Instagram video URL_');
    const result = await Func(match, 'instagram');
    if (result.platform === 'instagram' && result.mediaUrl) {
      await conn.sendMessage(message.user, {
        video: { url: result.mediaUrl },
        caption: `*Likes:* ${result.likes || 'N/A'}\n*Shares:* ${result.shares || 'N/A'}`,
      });
    } else {}
  },
});

CreatePlug({
  command: 'tik',
  category: 'download',
  desc: 'Download TikTok videos',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a TikTok video URL_');
    const result = await Func(match, 'tiktok');
    if (result.platform === 'tiktok' && result.content) {
      await conn.sendMessage(message.user, {
        video: { url: result.content },
        caption: `*username:* ${result.username}\n*Likes:* ${result.stats.likes}\n*Shares:* ${result.stats.shares}`,
      });
    } else {}
  },
});
        
