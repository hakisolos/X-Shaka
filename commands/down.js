const { CreatePlug } = require('../lib/commands');
const gTTS = require('gtts');
const g_i_s = require('g-i-s');

CreatePlug({
    command: 'tts',
    category: 'convert',
    desc: 'speech',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_need text_');
        const tts = new gTTS(match, 'en');
        const path = '/tmp/tts.mp3';
        tts.save(path, async (err) => {
            if (err) {
                console.error(err);
                return;}
            conn.sendMessage(message.user, { audio: { url: path }, mimetype: 'audio/mp4' }).catch((err) => {
                console.error(err);
                   });
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
        g_i_s({ searchTerm: match, queryStringAddition: '&safe=on' }, async (error, results) => {
            if (error) {
                console.error(error);
                return message.reply('_Error_'); }
            for (let i = 0; i < 5; i++) {
                const url = results[Math.floor(Math.random() * results.length)]?.url;
                if (url) {
                    conn.sendMessage(message.user, { image: { url } }).catch((err) => console.error(err));
                } else {}
            }
        });
    }
});
      
