const { exec } = require('child_process');
const { makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, makeInMemoryStore, Browsers } = require('@whiskeysockets/baileys');
const P = require('pino');
const path = require('path');
const util = require('util');
const { File } = require('megajs');
const fs = require('fs');
const { getPlugins } = require('./database/plugins');
const { serialize } = require('./lib/messages');
const { commands } = require('./lib/commands');
const CONFIG = require('./config');
const store = makeInMemoryStore({logger: P({ level: 'silent' }).child({ level: 'silent' }),});
const fetch = require('node-fetch');
globalThis.fetch = fetch;

async function auth() {
    const credz = path.join(__dirname, 'lib', 'session', 'creds.json');
    if (!fs.existsSync(credz)) {
      if (!CONFIG.app.session_name) {
         console.log('_session_id required_'); return;}
        const cxl_data = CONFIG.app.session_name;
        const mob = cxl_data.replace('Naxor~', '');
        try { const filer = File.fromURL(`https://mega.nz/file/${mob}`);
            const data_mode = await filer.download();
            const chunks = [];
            for await (const chunk of data_mode) { chunks.push(chunk); }
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(credz, buf);
            console.log('Session file saved');
          } catch (err) { console.error(err); }
    }}
auth();

async function startBot() {
    await CONFIG.app.sdb.sync();
    console.log('Sequelize connected ✅');
    const auth_creds = path.join(__dirname, 'lib', 'session');
    let { state, saveCreds } = await useMultiFileAuthState(auth_creds);
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Chrome'),
        syncFullHistory: true,
        emitOwnEvents: true,
        auth: state,
        version: (await fetchLatestBaileysVersion()).version,
    });

    store.bind(conn.ev);
    conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    msg.message = Object.keys(msg.message)[0] === 'ephemeralMessage' ? msg.message.ephemeralMessage.message : msg.message;
    const message = await serialize(msg, conn);
    if (!message || !message.key || !message.body) return;
    const me = message.key.remoteJid;
    if (message.sender !== me && ['protocolMessage', 'reactionMessage'].includes(message.type) && me === 'status@broadcast') {
      if (!Object.keys(store.groupMetadata).length) store.groupMetadata = await conn.groupFetchAllParticipating();
        return;}
    if (CONFIG.app.mode === true && !message.isFromMe) return;
    const mek = message.body.trim().toLowerCase();
    const isCmd = mek.startsWith(CONFIG.app.prefix.toLowerCase());
    const textt = mek.slice(CONFIG.app.prefix.length).trim();
    const owner = CONFIG.app.me;
    console.log("------------------\n" + `user: ${message.sender}\nchat: ${message.isGroup ? "group" : "private"}\nmessage: ${mek}\n` + "------------------");
    if (isCmd) {
        const pattern = new RegExp(`^(${CONFIG.app.prefix})(\\S+)`);
        const commando = mek.match(pattern);
        if (commando) {
            const command = commando[2];
            const match = message.body.trim().split(/ +/).slice(1).join(" ");
            const args = match;
            const dun = commands.find((c) => c.command.toLowerCase() === command);
            if (dun) {
                await dun.execute(message, conn, match, args, owner).catch((err) => console.error(err));
                if (dun.on && message.body) {
                    await dun.on(message, conn, match, args).catch((err) => console.error(err));
                }
            }}
         }
     });

    conn.ev.on('group-participants.update', async ({ id, participants, action }) => {
        const time = new Date().toLocaleTimeString();
        for (let participant of participants) {
            const img = await conn.profilePictureUrl(participant, 'image');
            let message = '';
            if (action === 'add') message = `_Welcome mate_ ${participant}\n _Time_: ${time}`;
            else if (action === 'remove') message = `_Until next time mate_ ${participant}\n_Time_: ${time}`;
            else if (action === 'promote') message = `_Congrats_ ${participant}\n _Youve been promoted_`;
            else if (action === 'demote') message = `${participant}\n_Youve been demoted_`;
            if (message) {
                await conn.sendMessage(id, {
                    text: message,
                    image: { url: img },
                    caption: message
                });
            }
        }
    });

    conn.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('Connection established ✅');
            await getPlugins();
            console.log('x-shaka ✅');
        }
    });
}

setTimeout(startBot, 3000)
    
