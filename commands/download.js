const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch'); 
const CONFIG = require('../config');

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Download',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide app name_');
    await message.react('🗣️');
    const search = `https://bk9.fun/search/apk?q=${match}`;
    const resi = await fetch(search).then((res) => res.json());
    if (!resi || !resi.BK9 || resi.BK9.length === 0) return;
    const down = `https://bk9.fun/download/apk?id=${resi.BK9[0].id}`;
    const mep = await fetch(down).then((res) => res.json());
    if (!mep || !mep.BK9 || !mep.BK9.dllink) return message.reply('_err');
    const detail = { document: { url: mep.BK9.dllink },fileName: mep.BK9.name, mimetype: "application/vnd.android.package-archive",caption: `*${mep.BK9.name}*\nMade with❣️`,};
    await conn.sendMessage(message.user, detail, { quoted: message });
  },
});

CreatePlug({
  command: 'emojimix',
  category: 'media',
  desc: 'Combine two emojis into a mixed emoji sticker',
  execute: async (message, conn, match) => {
    if (!match || !match.includes('+')) return message.reply('_Example usage: emojimix ❤️+🔥_');
    const [emoji1, emoji2] = match.split('+').map(e => e.trim());
    if (!emoji1 || !emoji2) return message.reply('_Please provide two emojis separated by "+"_');
    const res = await fetch(`https://api.yanzbotz.live/api/tools/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`);
    if (!res.ok) return message.reply('_err_');
    const data = await res.json(), _sti = data?.result?.[0]?.media_formats?.png_transparent?.url;
    if (!data || data.status !== 200 || !_sti) return message.reply('_Error_');
    await conn.sendMessage(message.user, _sti, { quoted: message, sticker: {} });
  },
});
