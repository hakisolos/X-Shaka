const { proto, getContentType, jidNormalizedUser, downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function fetchGroupAdmins(conn, groupId) {
    const metadata = await conn.groupMetadata(groupId);
    return metadata.participants
        .filter((member) => member.admin)
        .map((member) => jidNormalizedUser(member.id));
}

const downloadMedia = async (message) => {
    let type = Object.keys(message)[0];
    let msg = message[type];
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
            msg = message.viewOnceMessageV2?.message;
            type = Object.keys(msg || {})[0];
        } else type = Object.keys(msg || {})[1];
        msg = msg[type];
    }
    const stream = await downloadContentFromMessage(msg, type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
};

async function serialize(msg, conn) {
    if (msg.key) {
        msg.id = msg.key.id;
        msg.isFromMe = msg.key.fromMe;
        msg.user = jidNormalizedUser(msg.key.remoteJid);
        msg.isGroup = msg.user.endsWith('@g.us');
        msg.sender = msg.isGroup
            ? jidNormalizedUser(msg.key.participant)
            : msg.isFromMe
            ? jidNormalizedUser(conn.user.id)
            : msg.user;
    }
    if (msg.message) {
        msg.type = getContentType(msg.message);
        if (msg.type === 'ephemeralMessage') {
            msg.message = msg.message[msg.type]?.message;
            const typeKey = Object.keys(msg.message || {})[0];
            msg.type = typeKey;
        }
        msg.body =
            msg.message?.conversation ||
            msg.message?.[msg.type]?.text ||
            msg.message?.[msg.type]?.caption ||
            '';
        msg.send = async (jid, content, options = {}) => {
            return conn.sendMessage(jid, content, options);
        };
        msg.reply = (text, options = {}) =>
            msg.send(msg.user, { text }, { quoted: msg, ...options });
    }

    if (msg.isGroup) {
        const admins = await fetchGroupAdmins(conn, msg.user);
        msg.isAdmin = admins.includes(msg.sender);
        msg.isBotAdmin = admins.includes(jidNormalizedUser(conn.user.id));
    }

  
  return msg;
}

module.exports = { serialize };
