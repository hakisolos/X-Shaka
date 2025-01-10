const { 
    proto, 
    getContentType, 
    jidNormalizedUser, 
    downloadContentFromMessage,
    generateWAMessageContent, 
    extractMessageContent, 
    normalizeMessageContent 
} = require('@whiskeysockets/baileys');

const gc_object = {};
const downloadMedia = async (message) => {
    let type = Object.keys(message)[0];
    let media = message[type];
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
            media = message.viewOnceMessageV2?.message;
            type = Object.keys(media || {})[0];
        } else {
            type = Object.keys(media || {})[1];}
        media = media[type];}
    const stream = await downloadContentFromMessage(media, type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);}
    return buffer;
};

const fetchGroupAdmins = async (jid, conn) => {
    if (gc_object[jid] && gc_object[jid].expiry > Date.now()) {
        return gc_object[jid].admins;
    }try {
        const groupMetadata = await conn.groupMetadata(jid);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        gc_object[jid] = {
            admins,
            expiry: Date.now() + 5 * 60 * 1000, };
        return admins;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const serialize = async (message, conn) => {
    if (message.key) {
        message.id = message.key.id;
        message.isFromMe = message.key.fromMe;
        message.user = jidNormalizedUser(message.key.remoteJid);
        message.isGroup = message.user && message.user.endsWith('@g.us');
        message.device = /^3A/.test(message.id)
            ? 'ios'
            : /^3EB/.test(message.id)
            ? 'web'
            : /^.{21}/.test(message.id)
            ? 'android'
            : /^.{18}/.test(message.id)
            ? 'desktop'
            : 'unknown';

        message.sender = message.isGroup ? jidNormalizedUser(message.key.participant) : message.isFromMe ? jidNormalizedUser(conn.user.id) : message.user;
        message.isowner = message.sender === conn.user.id;
    }

    if (message.isGroup) {
        message.admins = await fetchGroupAdmins(message.user, conn);
        try {
            const groupMetadata = await conn.groupMetadata(message.user);
            message.isAdmin = groupMetadata.participants.some(p => p.id === message.sender && p.admin);
            message.isBotAdmin = groupMetadata.participants.some(p => p.id === jidNormalizedUser(conn.user.id) && p.admin);
        } catch (error) {
            message.isAdmin = false;
            message.isBotAdmin = false;
        }
    }

    if (message.message) {
        message.type = getContentType(message.message);
        if (message.type === 'ephemeralMessage') {
            message.message = message.message[message.type].message;
            const type = Object.keys(message.message)[0];
            message.type = type;
            if (type === 'viewOnceMessageV2') {
                message.message = message.message[message.type].message;
                message.type = getContentType(message.message);
            }
        }
        if (message.type === 'viewOnceMessageV2') {
            message.message = message.message[message.type].message;
            message.type = getContentType(message.message);
        }
        message.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type);
        try {
            const quoted = message.message[message.type]?.contextInfo;
            if (quoted?.quotedMessage['ephemeralMessage']) {
                const type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
                message.quoted = type === 'viewOnceMessageV2'
                    ? {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
                    }
                    : {
                        type: 'ephemeral',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message,
                    };
            } else if (quoted?.quotedMessage['viewOnceMessageV2']) {
                message.quoted = {
                    type: 'view_once',
                    stanzaId: quoted.stanzaId,
                    participant: jidNormalizedUser(quoted.participant),
                    message: quoted.quotedMessage.viewOnceMessage.message,
                };
            } else {
                message.quoted = {
                    type: 'normal',
                    stanzaId: quoted.stanzaId,
                    participant: jidNormalizedUser(quoted.participant),
                    message: quoted.quotedMessage,
                };
            }

            if (message.quoted) {
                message.quoted.isFromMe = message.quoted.participant === jidNormalizedUser(conn.user.id);
                message.quoted.mtype = Object.keys(message.quoted.message).find(v => v.includes('Message') || v.includes('conversation'));
                message.quoted.text =
                    message.quoted.message[message.quoted.mtype]?.text ||
                    message.quoted.message[message.quoted.mtype]?.description ||
                    message.quoted.message[message.quoted.mtype]?.caption ||
                    message.quoted.message[message.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
                    message.quoted.message[message.quoted.mtype] ||
                    '';
                   message.quoted.key = {
                    id: message.quoted.stanzaId,
                    fromMe: message.quoted.isFromMe,
                    remoteJid: message.user,
                };
                message.quoted.download = () => downloadMedia(message.quoted.message);
            }
        } catch (error) {
            message.quoted = null;
        }

        message.body =
            message.message?.conversation ||
            message.message?.[message.type]?.text ||
            message.message?.[message.type]?.caption ||
            (message.type === 'listResponseMessage' && message.message?.[message.type]?.singleSelectReply?.selectedRowId) ||
            (message.type === 'buttonsResponseMessage' && message.message?.[message.type]?.selectedButtonId) ||
            (message.type === 'templateButtonReplyMessage' && message.message?.[message.type]?.selectedId) ||
            '';

        message.reply = (text) => client.sendMessage(message.user, { text }, { quoted: message });
        message.mentions = [];
        if (message.quoted?.participant) message.mentions.push(message.quoted.participant);
        const mentionedJids = message?.message?.[message.type]?.contextInfo?.mentionedJid || [];
        message.mentions.push(...mentionedJids.filter(Boolean));
        message.download = () => downloadMedia(message.message);}
        message.react = async (emoji) => {
        if (!emoji) throw new Error('xastral');
        try {
            await conn.sendMessage(message.user, {
                react: { text: emoji, messageId: message.id }
            });
        } catch (error) {}
    };

    message.generateWAMessageContent = (messageData) => generateWAMessageContent(messageData, message.type);
    message.extractMessageContent = () => extractMessageContent(message.message);
    message.normalizeMessageContent = () => normalizeMessageContent(message.message);
    return message;
};

module.exports = {serialize};
        
