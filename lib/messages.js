const { proto, getContentType, jidNormalizedUser, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const CONFIG = require('../config');

async function fetchGroupAdmins(conn, groupId) {
    const metadata = await conn.groupMetadata(groupId);
    return metadata.participants
        .filter((member) => member.admin)
        .map((member) => jidNormalizedUser(member.id));
}

const downloadMedia = async (message) => {
    let type = Object.keys(message)[0]
    let m = message[type]
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
        m = message.viewOnceMessageV2?.message
        type = Object.keys(m || {})[0]
        } else type = Object.keys(m || {})[1]
        m = m[type]}
    const stream = await downloadContentFromMessage(m, type.replace('Message', ''))
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])}
    return buffer
}

async function serialize(msg, conn) {
    if (msg.key) {
        msg.id = msg.key.id;
        msg.isFromMe = msg.key.fromMe;
        msg.user = jidNormalizedUser(msg.key.remoteJid);
        msg.isGroup = msg.user.endsWith('@g.us');
        msg.device = /^3A/.test(msg.id) ? 'ios' : msg.id.startsWith('3EB') ? 'web' : /^.{21}/.test(msg.id) ? 'android' : /^.{18}/.test(msg.id) ? 'desktop' : 'unknown';
        msg.isbot = msg.id.startsWith('BAE5') || msg.id.startsWith('XAT');
        msg.sender = msg.isGroup
            ? jidNormalizedUser(msg.key.participant)
            : msg.isFromMe
            ? jidNormalizedUser(conn.user.id)
            : msg.user;
        msg.isowner = [conn.user.id, ...process.env.MODS.split(',').map(id => id.trim())]
            .includes(jidNormalizedUser(msg.sender)) || msg.sender === conn.user.id; 
    }

    if (msg.message) {
        msg.type = getContentType(msg.message);

        if (msg.type === 'stickerMessage') {
            msg.sticker = await downloadMedia(msg.message.stickerMessage);
            msg.body = 'processed';
        } else if (msg.type === 'imageMessage') {
            msg.image = await downloadMedia(msg.message.imageMessage);
            msg.body = 'processed';
        } else if (msg.type === 'videoMessage') {
            msg.video = await downloadMedia(msg.message.videoMessage);
            msg.body = 'processed';
        } else if (msg.type === 'documentMessage') {
            msg.document = await downloadMedia(msg.message.documentMessage);
            msg.body = 'processed';
        } else if (msg.type === 'audioMessage') {
            msg.audio = await downloadMedia(msg.message.audioMessage);
            msg.body = 'processed';
        } else {
            msg.body = msg.message?.conversation ||
                       msg.message?.[msg.type]?.text ||
                       msg.message?.[msg.type]?.caption || '';
        }

        msg.send = async (jid, content, options = {}) => {
            return conn.sendMessage(jid, content, options);};
        msg.reply = async (text, options = {}) => {
            return msg.send(msg.user, { text }, { quoted: msg, ...options });
        };
        
        msg.forward = async (message, conn, jid, options = {}) => {
            try {
                return await conn.forwardMessage(jid, message, options); 
            } catch (error) { 
                console.log(error); 
            }
        };

        msg.react = async (emoji) => {
            try {
                await conn.sendMessage(msg.user, { react: { text: emoji, key: msg.key } });
            } catch (error) {
                console.log(error);
            }
        };

        msg.loadMessage = async () => {
            try {
                const message = await conn.loadMessage(msg.user, msg.id);
                return message;
            } catch (error) {
                console.log(error);
                return null;
            }
        };
    }

    if (msg.isGroup) {
        const admins = await fetchGroupAdmins(conn, msg.user);
        msg.isAdmin = admins.includes(msg.sender);
        msg.isBotAdmin = admins.includes(jidNormalizedUser(conn.user.id));
    }

    return msg;
}

module.exports = { serialize };
