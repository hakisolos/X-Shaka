const { CreatePlug } = require('../lib/commands');
const fetch = require('node-fetch'); 

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Download',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide app name_');
    const search = `https://bk9.fun/search/apk?q=${match}`;
    const resi = await fetch(search).then((res) => res.json());
    if (!resi || !resi.BK9 || resi.BK9.length === 0) return;
    const down = `https://bk9.fun/download/apk?id=${resi.BK9[0].id}`;
    const mep = await fetch(down).then((res) => res.json());
    if (!mep || !mep.BK9 || !mep.BK9.dllink) return message.reply('_err');
    const detail = {
      document: { url: mep.BK9.dllink },
      fileName: mep.BK9.name,
      mimetype: "application/vnd.android.package-archive",
      caption: `*${mep.BK9.name}*\nDownload your APK now`,
    };

    await conn.sendMessage(message.user, detail, { quoted: message });
  },
});
