const { proto, getContentType, downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys');

async function serialize(conn, _msg) {
    try {
        if (!_msg || !_msg.key) {
            console.error('Invalid message object');
            return null;
        }
        _msg.id = _msg.key.id;
        _msg.isGroup = _msg.key.remoteJid && _msg.key.remoteJid.endsWith('@g.us');
        _msg.sender = jidNormalizedUser(_msg.key.participant || _msg.key.remoteJid);
        _msg.user = jidNormalizedUser(_msg.key.remoteJid);
        _msg.isFromMe = _msg.key.fromMe ? jidNormalizedUser(conn.user.id) === _msg.user : false;
        if (!_msg.message) {
            _msg.message = {};
        }

        const type = getContentType(_msg.message);
        _msg.type = type || 'unknown';
        _msg.content = type ? _msg.message[type] : null;
        _msg.body = '';
        if (type === 'conversation') {
            _msg.text = _msg.message.conversation || '';
        } else if (type === 'extendedTextMessage' && _msg.message.extendedTextMessage) {
            _msg.text = _msg.message.extendedTextMessage.text || '';
        } else if (type === 'imageMessage' && _msg.message.imageMessage) {
            _msg.text = _msg.message.imageMessage.caption || '';
        } else if (type === 'videoMessage' && _msg.message.videoMessage) {
            _msg.text = _msg.message.videoMessage.caption || '';
        } else if (type === 'documentMessage' && _msg.message.documentMessage) {
            _msg.text = _msg.message.documentMessage.caption || '';
        } else if (type === 'audioMessage' && _msg.message.audioMessage) {
            _msg.text = _msg.message.audioMessage.caption || '';
        } else if (type === 'listResponseMessage' && _msg.message.listResponseMessage) {
            _msg.text = _msg.message.listResponseMessage.title || '';
        } else if (type === 'buttonMessage' && _msg.message.buttonMessage) {
            _msg.text = _msg.message.buttonMessage.text || '';
        } else if (type === 'reactionMessage' && _msg.message.reactionMessage) {
            _msg.text = _msg.message.reactionMessage.text || '';
        }

        _msg.downloadMedia = async () => {
            if (['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(type)) {
                try {
                    const stream = await downloadContentFromMessage(_msg.message[type], type.replace('Message', ''));
                    const buffer = [];
                    for await (const chunk of stream) {
                        buffer.push(chunk);}
                    return Buffer.concat(buffer);
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
            return null;
        };

        _msg.reply = (text, options = {}) => {
            if (!_msg.user) {
              return Promise.reject(new Error('Nofound'));
            }
            return conn.sendMessage(_msg.user, { text }, { quoted: _msg, ...options });
        };

        _msg.forward = (jid, options = {}) => {
            if (!jid) {
                console.error('Cannot forward: No jid provided');
                return Promise.reject(new Error('No jid provided'));
            }
            const normalizedJid = jidNormalizedUser(jid);
            return conn.sendMessage(normalizedJid, { text: _msg.text }, { quoted: null, ...options });
        };

        if (_msg.isGroup) {
            const groupMetadata = await conn.groupMetadata(_msg.key.remoteJid);
            const admins = groupMetadata.participants.filter(p => p.admin).map(p => jidNormalizedUser(p.id));
            _msg.isAdmin = admins.includes(_msg.user);
            _msg.isBotAdmin = admins.includes(jidNormalizedUser(conn.user.id));
        }

        _msg.react = async (key) => {
            if (!_msg.message || !_msg.message.reactionMessage) {
            return;
            } try {
                await conn.sendMessage(_msg.user, { react: { text: key, key: _msg.key } });
            } catch (error) {
                console.error(error);
            }
        };

        return _msg;
    } catch (err) {
        console.error('Serialize error:', err);
        return null;
    }
}

module.exports = { serialize };
          
