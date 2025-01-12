const { CreatePlug } = require('../lib/commands');
const gTTS = require('gtts');
const g_i_s = require('g-i-s');

CreatePlug({
    command: 'tts',
    category: 'convert',
    desc: 'speech',
    execute: async (message, conn, args) => {
        if (!args) return message.reply('_need text_');
        const tts = new gTTS(args, 'en');
        const path = '/tmp/tts.mp3';
        tts.save(path, async (err) => {
            if (err) return message.reply('_err_');
            await conn.sendMessage(message.user, { audio: { url: path }, mimetype: 'audio/mp4' });
        });
    }
});

CreatePlug({
    command: 'img',
    category: 'download',
    desc: 'download images',
    execute: async (message, conn, match) => {                   
     if (!match) return message.reply('_example img so n goku_');
      await message.react('✔️');
      await message.reply('*Downloading 5 images...*');
      await g_i_s({ searchTerm: match, queryStringAddition: '&safe=on' }, async (error, result) => {
      if (error) return;
     for (let i = 0; i < 5; i++) {
        try { let url = result[Math.floor(Math.random() * result.length)]?.url;
            if (url) await conn.sendMessage(message.user, { image: { url } });
        } catch (err) { console.error(err); }
    }
});
                                        
