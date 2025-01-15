const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch'); 
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
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
  command: 'sticker',
  category: 'media',
  desc: 'Convert an image or video to a sticker',
  execute: async (message, conn) => {
    if (!message.quoted) return message.reply('_Reply to an image or video_');
    const media = await message.downloadMedia();
    const sticker = new Sticker(media, {
      pack: CONFIG.app.packname,
      type: StickerTypes.FULL, 
      quality: 100, 
      background: 'transparent'
    });

    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(message.user, { sticker: stickerBuffer }, { quoted: message });
  },
});
      
