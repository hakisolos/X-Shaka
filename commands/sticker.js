const { CreatePlug } = require('../lib/commands');
const { createSticker } = require('../lib/sticker'); 
const CONFIG = require('../config'); 

CreatePlug({
  command: 'sticker',
  category: 'converter',
  desc: 'sticker maker img or vid',
  execute: async (message, conn, match) => {
    const pack = CONFIG.app.packname; 
    if (!(message?.message?.imageMessage || message?.message?.videoMessage)) return message.reply('_Please *** image or video_');
      const sti = await conn.downloadMediaMessage(message.message);
      const baffu = await createSticker(sti, '512x512', 80, 0, pack);  
      await conn.sendMessage(message.user, { sticker: baffu, packname: pack });
  }
});
    
