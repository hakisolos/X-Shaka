const { CreatePlug } = require('../lib/commands.js');

CreatePlug({
    command: 'st2img',
    category: 'converter',
    desc: 'Convert sticker to image',
    execute: async (message, conn, match) => {
        if (!message.message || !(message.message.stickerMessage || message.message.sticker)) {
        return message.reply('_Please send a sticker_');}
        const args = match ? match.split(' ') : [];
        const caption = args.length > 0 ? args.join(' ') : '*_Here is your image_*'; 
        const media = await conn.downloadMediaMessage(message);
        if (media) {
            await conn.sendMessage(message.user, { image: media }, { caption });
        } else {
            return message.reply('_err_');
        }
    }
});
        
