Can you fix this error 
	
2025-01-06T17:14:56.987181+00:00 app[worker.1]: 0|xastral  |     at JSON.parse (<anonymous>)
2025-01-06T17:14:56.987182+00:00 app[worker.1]: 0|xastral  |     at serialize (/root/Diegoson/lib/messages.js:202:34)
2025-01-06T17:14:56.987182+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/index.js:76:35)
2025-01-06T17:14:56.987199+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:525:35)
2025-01-06T17:14:56.987200+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:40:16)
2025-01-06T17:14:56.987200+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:513:28)
2025-01-06T17:14:56.987201+00:00 app[worker.1]: 0|xastral  |     at Object.emit (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:94:23)
2025-01-06T17:14:56.987212+00:00 app[worker.1]: 0|xastral  |     at Timeout._onTimeout (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/process-message.js:208:36)
2025-01-06T17:14:56.987213+00:00 app[worker.1]: 0|xastral  |     at listOnTimeout (node:internal/timers:559:17)
2025-01-06T17:14:56.987213+00:00 app[worker.1]: 0|xastral  |     at processTimers (node:internal/timers:502:7)
2025-01-06T17:15:10.669445+00:00 app[worker.1]: 0|xastral  | SyntaxError: Unexpected token u in JSON at position 0
2025-01-06T17:15:10.669458+00:00 app[worker.1]: 0|xastral  |     at JSON.parse (<anonymous>)
2025-01-06T17:15:10.669465+00:00 app[worker.1]: 0|xastral  |     at serialize (/root/Diegoson/lib/messages.js:202:34)
2025-01-06T17:15:10.669478+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/index.js:76:35)
2025-01-06T17:15:10.669490+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:525:35)
2025-01-06T17:15:10.669511+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:40:16)
2025-01-06T17:15:10.669513+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:513:28)
2025-01-06T17:15:10.669525+00:00 app[worker.1]: 0|xastral  |     at Object.flush (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:73:16)
2025-01-06T17:15:10.669536+00:00 app[worker.1]: 0|xastral  |     at processNodeWithBuffer (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Socket/messages-recv.js:800:12)
2025-01-06T17:15:24.931008+00:00 app[worker.1]: 0|xastral  | SyntaxError: Unexpected token u in JSON at position 0
2025-01-06T17:15:24.931020+00:00 app[worker.1]: 0|xastral  |     at JSON.parse (<anonymous>)
2025-01-06T17:15:24.931020+00:00 app[worker.1]: 0|xastral  |     at serialize (/root/Diegoson/lib/messages.js:202:34)
2025-01-06T17:15:24.931039+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/index.js:76:35)
2025-01-06T17:15:24.931040+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:525:35)
2025-01-06T17:15:24.931051+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:40:16)
2025-01-06T17:15:24.931060+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:513:28)
2025-01-06T17:15:24.931070+00:00 app[worker.1]: 0|xastral  |     at Object.flush (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:73:16)
2025-01-06T17:15:24.931080+00:00 app[worker.1]: 0|xastral  |     at processNodeWithBuffer (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Socket/messages-recv.js:800:12)
2025-01-06T17:15:25.431404+00:00 app[worker.1]: 0|xastral  | SyntaxError: Unexpected token u in JSON at position 0
2025-01-06T17:15:25.431417+00:00 app[worker.1]: 0|xastral  |     at JSON.parse (<anonymous>)
2025-01-06T17:15:25.431417+00:00 app[worker.1]: 0|xastral  |     at serialize (/root/Diegoson/lib/messages.js:202:34)
2025-01-06T17:15:25.431429+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/index.js:76:35)
2025-01-06T17:15:25.431440+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:525:35)
2025-01-06T17:15:25.431453+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:40:16)
2025-01-06T17:15:25.431455+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:513:28)
2025-01-06T17:15:25.431507+00:00 app[worker.1]: 0|xastral  |     at Object.emit (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js:94:23)
2025-01-06T17:15:25.431508+00:00 app[worker.1]: 0|xastral  |     at Timeout._onTimeout (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/process-message.js:208:36)
2025-01-06T17:15:25.431508+00:00 app[worker.1]: 0|xastral  |     at listOnTimeout (node:internal/timers:559:17)
2025-01-06T17:15:25.431508+00:00 app[worker.1]: 0|xastral  |     at processTimers (node:internal/timers:502:7)
2025-01-06T17:15:31.943272+00:00 app[worker.1]: 0|xastral  | SyntaxError: Unexpected token u in JSON at position 0
2025-01-06T17:15:31.943282+00:00 app[worker.1]: 0|xastral  |     at JSON.parse (<anonymous>)
2025-01-06T17:15:31.943283+00:00 app[worker.1]: 0|xastral  |     at serialize (/root/Diegoson/lib/messages.js:202:34)
2025-01-06T17:15:31.943283+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/index.js:76:35)
2025-01-06T17:15:31.943284+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.emit (node:events:525:35)
2025-01-06T17:15:31.943284+00:00 app[worker.1]: 0|xastral  |     at EventEmitter.<anonymous> (/root/Diegoson/node_modules/@whiskeysockets/baileys/lib/Utils/event-bufferfix

const baileys = require('@whiskeysockets/baileys');
const { jidNormalizedUser, extractMessageContent, areJidsSameUser, downloadMediaMessage } = baileys;
const path = require('path');
const fs = require('fs');
const pino = require('pino');
const { parsePhoneNumber } = require('libphonenumber-js');
const { fileTypeFromBuffer } = require('file-type');

const parseMessage = (message) => {
    const participant = message.key?.participant || message.key?.remoteJid;
    return {
        type: Object.keys(message.message || {})[0],
        sender: participant, 
        body: message.message?.conversation || message.message?.extendedTextMessage?.text || "",
        key: message.key,
    };
};

const getContentType = (content) => {
    if (content) {
        const keys = Object.keys(content);
        const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage');
        return key;
    }
};

function Client({ conn, store }) {
    const client = Object.defineProperties(conn, {
        getName: {
            value(jid) {
                let id = jidNormalizedUser(jid);
                if (id.endsWith('g.us')) {
                    let metadata = store.groupMetadata?.[id];
                    return metadata.subject;
                } else {
                    let metadata = store.contacts[id];
                    return metadata?.name || metadata?.verifiedName || metadata?.notify || parsePhoneNumber('+' + id.split('@')[0]).format('INTERNATIONAL');
                }
            },
        },

        getFile: {
            async value(source, saveToFile = false) {
                let res;
                let filename;
                if (Buffer.isBuffer(source)) {
                    return { data: source, filename: '', mime: '', ext: '' };
                } else if (typeof source === 'string') {
                    if (fs.existsSync(source)) {
                        filename = source;
                        res = await fs.promises.readFile(source);
                    } else {
                        const response = await fetch(source);
                        res = await response.buffer();
                        filename = source.split('/').pop();
                    }
                } else {
                    throw new TypeError('Invalid source type');
                }

                const { ext, mime } = await fileTypeFromBuffer(res) || { ext: '', mime: 'application/octet-stream' };
                if (saveToFile) {
                    await fs.promises.writeFile(path.join(process.cwd(), filename), res);
                }

                return { data: res, filename, mime, ext };
            },
            enumerable: true,
        },

	    sendFile: {
            async value(user, filePath, filename = "", caption = "", quoted, ptt = false, options = {}) {
                try {
                    let { data: file, filename: pathFile, mime, ext } = await this.getFile(filePath, true);
                    const fileSize = fs.statSync(pathFile).size / (1024 * 1024);
                    if (fileSize >= 2e3) throw new Error("File size is too big!");
                    let opt = quoted ? { quoted: quoted } : {};
                    let mtype, mimetype = options.mimetype || mime;
                    let buffer, bufferAudio;
                    switch (true) {
                        case /^image\/webp/.test(mime):
                            buffer = options.asImage ? await webp2png(file) : await writeExifWebp(file, options);
                            file = buffer || file;
                            mtype = options.asImage ? "image" : "sticker";
                            mimetype = options.asImage ? "image/png" : "image/webp";
                            break;
                        case /^image\//.test(mime):
                            buffer = options.asSticker && (await mediaToSticker(file) || await imageToWebp(file)) || (options.packname || options.author) && await writeExifImg(await mediaToSticker(file) || await imageToWebp(file), options);
                            file = buffer || file;
                            mtype = buffer ? "sticker" : "image";
                            mimetype = buffer ? "image/webp" : mime;
                            break;
                        case /^video\//.test(mime):
                            bufferAudio = options.asAudio ? await toAudio(file, ext) : null;
                            if (bufferAudio) {
                                file = bufferAudio.data || file;
                                pathFile = bufferAudio.filename;
                                mtype = "audio";
                                mimetype = options.mimetype || "audio/mp4";
                                ptt = ptt || options.ptt || false;
                            } else {
                                buffer = options.asSticker && (await mediaToSticker(file) || await videoToWebp(file)) || (options.packname || options.author) && await writeExifVid(await mediaToSticker(file) || await videoToWebp(file), options);
                                file = buffer || file;
                                mtype = buffer ? "sticker" : "video";
                            }
                            break;
                        default:
                            mtype = "document";
                            mimetype = options.mimetype || mime;
                    }

                    return await this.sendMessage(user, {
                        [mtype]: { url: pathFile || file },
                        mimetype: mimetype,
                        caption: caption || "",
                        ...opt,
                    }, { quoted });
                } catch (error) {
                    console.error(error);
                }
            },
            enumerable: true,
        },

        downloadMediaMessage: {
            async value(message, filename) {
                let media = await downloadMediaMessage(
                    message,
                    'buffer',
                    {},
                    {
                        logger: pino({ timestamp: () => `,"time":"${new Date().toJSON()}"`, level: 'fatal' }).child({ class: 'conn' }),
                        reuploadRequest: conn.updateMediaMessage,
                    }
                );

                if (filename) {
                    let mime = await fileTypeFromBuffer(media);
                    let filePath = path.join(process.cwd(), `${filename}.${mime.ext}`);
                    await fs.promises.writeFile(filePath, media);
                    return filePath;
                }

                return media;
            },
            enumerable: true,
        },

        cMod: {
            value(user, copy, text = '', sender = conn.user.id, options = {}) {
                let mtype = getContentType(copy.message);
                let content = copy.message[mtype];
                if (typeof content === 'string') copy.message[mtype] = text || content;
                else if (content.caption) content.caption = text || content.caption;
                else if (content.text) content.text = text || content.text;
                if (typeof content !== 'string') {
                    copy.message[mtype] = { ...content, ...options };
                    copy.message[mtype].contextInfo = {
                        ...(content.contextInfo || {}),
                        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [],
                    };
                }
                if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
                if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
                else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
                copy.key.remoteJid = user;
                copy.key.fromMe = areJidsSameUser(sender, conn.user.id);
                return baileys.proto.WebMessageInfo.fromObject(copy);
            },
            enumerable: false,
        },
    });

    return client;
}

async function serialize(conn, msg, store) {
    const m = {};
    if (!msg.message) return;
    m.message = parseMessage(msg.message);
    if (msg.key) {
        m.key = msg.key;
        m.user = m.key.remoteJid.startsWith('status') ? jidNormalizedUser(m.key?.participant || msg.participant) : jidNormalizedUser(m.key.remoteJid);
        m.fromMe = m.key.fromMe;
        m.id = m.key.id;
        m.device = /^3A/.test(m.id) ? 'ios' : m.id.startsWith('3EB') ? 'web' : /^.{21}/.test(m.id) ? 'android' : /^.{18}/.test(m.id) ? 'desktop' : 'unknown';
        m.isBot = m.id.startsWith('BAE5') || m.id.startsWith('HSK');
        m.isGroup = m.user.endsWith('@g.us');
        m.participant = jidNormalizedUser(msg?.participant || m.key.participant) || false;
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : m.isGroup ? m.participant : m.user);
    }

    if (m.isGroup) {
        if (!(m.user in store.groupMetadata)) store.groupMetadata[m.user] = await conn.groupMetadata(m.user);
        m.metadata = store.groupMetadata[m.user];
        m.groupAdmins = m.isGroup && m.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []);
        m.isAdmin = m.isGroup && !!m.groupAdmins.find(member => member.id === m.sender);
        m.isBotAdmin = m.isGroup && !!m.groupAdmins.find(member => member.id === jidNormalizedUser(conn.user.id));
    }

    m.pushName = msg.pushName;
    try {
        if (m.sender && CONFIG.app.mods) {
            const naxors = CONFIG.app.mods;
            m.isOwner = naxors.includes(m.sender.replace(/\D+/g, ''));
        } else {
            m.isOwner = false;
        }
    } catch (err) {
        console.error("erro parsing:", err);
        m.isOwner = false; 
    }

    if (m.message) {
        m.type = getContentType(m.message) || Object.keys(m.message)[0];
        m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
        m.mentions = [...(m.msg?.contextInfo?.mentionedJid || []), ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
        m.body = m.msg?.text || m.msg?.conversation || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || '';
        m.prefix = m.body.startsWith(CONFIG.app.prefix) ? CONFIG.app.prefix : '';		
        m.command = m.body && m.body.trim().replace(m.prefix, '').trim().split(/ +/).shift();
        m.args = m.body
        .trim()
        .replace(m.prefix, '') 
        .replace(m.command, '')
        .split(/ +/) 
        .filter(a => a) || []; 
        m.text = m.args.join(' ').trim();
        m.expiration = m.msg?.contextInfo?.expiration || 0;
        m.timestamps = typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp * 1000 : m.msg.timestampMs * 1000;
        m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
        m.isQuoted = false;
        if (m.msg?.contextInfo?.quotedMessage) {
            m.isQuoted = true;
            m.quoted = {};
            m.quoted.message = parseMessage(m.msg?.contextInfo?.quotedMessage);
            if (m.quoted.message) {
                m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
                m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
                m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;
                m.quoted.key = {
                    remoteJid: m.msg?.contextInfo?.remoteJid || m.user,
                    participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
                    fromMe: areJidsSameUser(jidNormalizedUser(m.msg?.contextInfo?.participant), jidNormalizedUser(conn?.user?.id)),
                    id: m.msg?.contextInfo?.stanzaId,
                };
                m.quoted.user = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid) ? m.quoted.key.participant : m.quoted.key.remoteJid;
                m.quoted.fromMe = m.quoted.key.fromMe;
                m.quoted.id = m.msg?.contextInfo?.stanzaId;
                m.quoted.device = /^3A/.test(m.quoted.id) ? 'ios' : /^3E/.test(m.quoted.id) ? 'web' : /^.{21}/.test(m.quoted.id) ? 'android' : /^.{18}/.test(m.quoted.id) ? 'desktop' : 'unknown';
                m.quoted.isBot = m.quoted.id.startsWith('BAE5') || m.quoted.id.startsWith('HSK');
                m.quoted.isGroup = m.quoted.user.endsWith('@g.us');
                m.quoted.participant = jidNormalizedUser(m.msg?.contextInfo?.participant) || false;
                m.quoted.sender = jidNormalizedUser(m.msg?.contextInfo?.participant || m.quoted.user);
                m.quoted.mentions = [...(m.quoted.msg?.contextInfo?.mentionedJid || []), ...(m.quoted.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
                m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted.msg?.name || '';
                m.quoted.prefix = m.body.startsWith(CONFIG.app.prefix) ? CONFIG.app.prefix : '';		
                m.quoted.command = m.quoted.body && m.quoted.body.trim().replace(m.quoted.prefix, '').trim().split(/ +/).shift();
                m.quoted.args =
                m.quoted.args = m.quoted.body
        .trim()
        .replace(m.quoted.prefix, '')
        .replace(m.quoted.command, '')
        .split(/ +/)
        .filter(a => a) || [];
                m.quoted.text = m.quoted.args.join(' ').trim();
                m.quoted.cMod = function (user, text = '', sender = conn.user.id) {
                    return conn.cMod(user, m.quoted, text, sender);
                };
            }
        }

        return m;
    } 
}

module.exports = { Client, serialize };
