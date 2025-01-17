const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch'); 
const CONFIG = require('../config');
const { Func } = require('./downloads/fbdl');

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Download',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide app name_');
    await message.react('🗣️');
    const search = `https://bk9.fun/search/apk?q=${match}`;
    const smd = await fetch(search).then((res) => res.json());
    if (!smd || !smd.BK9 || smd.BK9.length === 0) return;
    const down = `https://bk9.fun/download/apk?id=${smd.BK9[0].id}`;
    const void = await fetch(down).then((res) => res.json());
    if (!void || !void.BK9 || !void.BK9.dllink) return message.reply('_err');
    const detail = { document: { url: void.BK9.dllink },fileName: void.BK9.name, mimetype: "application/vnd.android.package-archive",caption: `*${void.BK9.name}*\nMade with❣️`,};
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
    const void = await Func(match);
    if (!void) return message.reply('_err_');
    const smd = void["720p"] || void["360p"];
    const quality = void["720p"] ? '720p (HD)' : '360p (SD)';
    if (!smd) return;
    await conn.sendMessage(message.user, { video: { url: smd }, caption: `*Quality:* ${quality}\nMade with ❣️` });
  }
});
    
