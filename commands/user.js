const { CreatePlug } = require('../lib/commands');
const gTTS = require('gtts');

CreatePlug({
    command: 'tts',
    category: 'convert',
    desc: 'speech',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_need text_');
        const tts = new gTTS(match, 'en');
        const path = '/tmp/tts.mp3';
        tts.save(path, async (err) => {
            if (err) return message.reply('_err_');
            await conn.sendMessage(message.user, { audio: { url: path }, mimetype: 'audio/mp4' });
        });
    }
});

const getChats = async (conn) => {
    const chats = await conn.chats.all();
    return { 
        groups: chats.filter(chat => chat.id.endsWith('@g.us')),
        users: chats.filter(chat => !chat.id.endsWith('@g.us'))
    };
};

CreatePlug({
    command: 'getgc',
    category: 'admin',
    desc: 'groups',
    execute: async (message, conn, match) => {
        if (!message.isFromMe) return;
        const { groups } = await getChats(conn);
        const mime = await Promise.all(groups.map(async (group, index) => {
            const name = (await conn.groupMetadata(group.id)).subject;
            return `${index + 1}. ${name}\n   *Jid:* ${group.id}`;
        }));
        await conn.sendMessage(message.user, { text: `*Groups:*\n${mime.join('\n\n')}` });
    }
});

CreatePlug({
    command: 'leave',
    category: 'admin',
    desc: 'gc_leave',
    execute: async (message, conn, match) => {
        const isAdmin = conn.user.id;
        if (!isAdmin) return;
        await conn.groupLeave(message.user);
    }
});
    
CreatePlug({
    command: 'vv',
    category: 'convert',
    desc: 'Convert viewonce to regular media',
    execute: async (message, conn, match) => {
          if (message.type === 'viewOnceMessageV2') {
            const mediaBuffer = await downloadMedia(message.message.viewOnceMessageV2);
            let caption = '';
            if (message.type === 'imageMessage') {
                caption = 'Here is your image';
            } else if (message.type === 'videoMessage') {
                caption = 'Here is your video';}
                await message.forward(message, conn, message.user, { quoted: message });
             if (message.type === 'imageMessage') {
                await conn.sendMessage(message.user, { image: mediaBuffer, caption }, { quoted: message });
            } else if (message.type === 'videoMessage') {
                await conn.sendMessage(message.user, { video: mediaBuffer, caption }, { quoted: message });
            }
          }
    }
});
