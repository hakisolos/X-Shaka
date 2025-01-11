const { CreatePlug } = require('../lib/commands');
const gTTS = require('gtts');

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
    command: 'leave',
    category: 'admin',
    desc: 'gc_leave',
    execute: async (message, conn) => {
        const isAdmin = message.isowner;
        if (!isAdmin) return;
        await conn.groupLeave(message.user);
    }
});
    
                                                           
