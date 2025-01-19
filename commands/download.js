const { CreatePlug } = require('../lib/commands');
const {getBuffer} = require('./downloads/funcs');
const fetch = require('node-fetch'); 
const CONFIG = require('../config');
const { Func } = require('./downloads/fbdl');
const { Ring } = require('./downloads/Ring');
const APIUtils = require('./downloads/APIUtils');

CreatePlug({
  command: 'twitter',
  category: 'download',
  desc: 'Download media from Twitter',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid Twitter url_');
    const voidi = await APIUtils.twitt(match);
    if (voidi) {
      await conn.sendMessage(message.user, {
        video: { url: voidi.downloadLink,
           },
        caption: `${voidi.videoTitle}\n${voidi.videoDescription}\n\nMade with❣️`,
      });
    } else {
    }
  },
});

CreatePlug({
  command: 'snackvideo',
  category: 'download',
  desc: 'Download media from SnackVideo',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid url_');
    const voidi = await APIUtils.SnackVideo(match);
    if (voidi) {
      await conn.sendMessage(message.user, {
        video: { url: voidi.videoUrl, },
        caption: `${voidi.description}\n${voidi.uploadDate}\n${voidi.duration}\n\nMade with❣️`,
      });
    } else {
        }
  },
});

CreatePlug({
  command: 'seegore',
  category: 'download',
  desc: 'Download media from SeeGore',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid SeeGore url_');
    const voidi = await APIUtils.SeeGore(match);
    if (voidi) {
      await conn.sendMessage(message.user, {
        video: { url: voidi.videoSrc, },
        caption: `${voidi.title}\n${voidi.postedOn}\n${voidi.viewsCount}\n\nMade With❣️`,
      });
    } else {
        }
  },
});

CreatePlug({
  command: 'spotify',
  category: 'download',
  desc: 'Download media from Spotify',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid Spotify URL_');
    const voidi = await APIUtils.Spotify(match);
    await conn.sendMessage(message.user, {
      audio: {
        url: voidi.downloadLink,
        mimetype: 'audio/mpeg',
        ptt: false,
      },
    });
  },
});

CreatePlug({
  command: 'ytmp3',
  category: 'download',
  desc: 'Download audio from YouTube',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid YouTube url_');
    const voidi = await APIUtils.Ytmp3(match);
      await conn.sendMessage(message.user, {
        audio: {
          url: voidi.downloadLink,
          mimetype: 'audio/mpeg', 
        },
        contextInfo: {
          externalAdReply: { title: voidi.title,
            body: "Ytmp3 Downloader", mediaType: 3,
            mediaUrl: match,
            thumbnailUrl: 'https://i.ytimg.com/vi/default.jpg', 
            sourceUrl: match,
          },
        },
      });
    }});



CreatePlug({
  command: 'ytmp4',
  category: 'download',
  desc: 'Download video from YouTube',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a valid YouTube url_');
    const voidi = await APIUtils.Ytmp4(match);
    await conn.sendMessage(message.user, {
        video: {
          url: voidi.downloadLink,
        }, caption: `${voidi.title}\n\nMade with❣️`,
      });
    } 
  });
    
CreatePlug({
  command: 'ringtone',
  category: 'download',
  desc: 'send ringtones based on a query',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('Please provide a search query');
    await message.react('❣️');
    const results = await Ring(match);
    if (!results?.length) return;
    const ringtone = results[0];
    await conn.sendMessage(message.user, {audio: { url: ringtone.audio },mimetype: 'audio/mpeg', fileName: `${ringtone.title}.mp3`, caption: `*Title:* ${ringtone.title}\nMade with❣️`
    }).catch(err => {
      console.error(err.message);
          });
  }
});
    
CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Download',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide app name_');
    await message.react('❣️');
    const search = `https://bk9.fun/search/apk?q=${match}`;
    const smd = await fetch(search).then((res) => res.json());
    if (!smd || !smd.BK9 || smd.BK9.length === 0) return;
    const down = `https://bk9.fun/download/apk?id=${smd.BK9[0].id}`;
    const voidi = await fetch(down).then((res) => res.json());
    if (!voidi || !voidi.BK9 || !voidi.BK9.dllink) return message.reply('_err');
    const detail = { document: { url: voidi.BK9.dllink },fileName: voidi.BK9.name, mimetype: "application/vnd.android.package-archive",caption: `*${voidi.BK9.name}*\nMade with❣️`,};
    await conn.sendMessage(message.user, detail, { quoted: message });
  },
});

CreatePlug({
  command: 'emojimix',
  category: 'media',
  desc: 'Combine two emojis into a mixed emoji sticker',
  execute: async (message, conn, match) => {
    if (!match || !match.includes(',')) return message.reply('_Example usage: emojimix ❤️+🔥_');
    const [emoji1, emoji2] = match.split('+').map(e => e.trim());
    if (!emoji1 || !emoji2) return message.reply('_Please provide two emojis separated by "+"_');
    const res = await fetch(`https://api.yanzbotz.live/api/tools/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`);
    if (!res.ok) return message.reply('_err_');
    const data = await res.json(), _sti = data?.result?.[0]?.media_formats?.png_transparent?.url;
    if (!data || data.status !== 200 || !_sti) return message.reply('_Error_');
    await conn.sendMessage(message.user, _sti, { quoted: message, sticker: {} });
  },
});


CreatePlug({
  command: 'facebook',
  category: 'download',
  desc: 'Download Facebook videos',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a Facebook video URL_');
    await message.react('❣️');
    const voidi = await Func(match);
    if (!voidi) return message.reply('_err_');
    const smd = voidi["720p"] || voidi["360p"];
    const quality = voidi["720p"] ? '720p (HD)' : '360p (SD)';
    if (!smd) return;
    await conn.sendMessage(message.user, { video: { url: smd }, caption: `*Quality:* ${quality}\nMade with ❣️` });
  }
});
    
