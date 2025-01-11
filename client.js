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
const store = makeInMemoryStore({
    logger: P({ level: 'silent' }).child({ level: 'silent' }),
});
const fetch = require('node-fetch');
globalThis.fetch = fetch;

async function auth() {
    const credz = path.join(__dirname, 'lib', 'session', 'creds.json');
    if (!fs.existsSync(credz)) {
        if (!CONFIG.app.session_name) {
            console.log('_session_id required_');
            return;
        }
        const cxl_data = CONFIG.app.session_name;
        const mob = cxl_data.replace('Naxor~', '');
        try {
            const filer = File.fromURL(`https://mega.nz/file/${mob}`);
            const data_mode = await filer.download();
            const chunks = [];
            for await (const chunk of data_mode) {
                chunks.push(chunk);
            }
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(credz, buf);
            console.log('Session file saved');
        } catch (err) {
            console.error(err);
        }
    }
}
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
    conn.ev.on('creds.update', saveCreds);
    conn.ev.on('messages.upsert', async ({ messages }) => {
   if (messages.type !== 'notify') return;
  const message = serialize(messages.messages[0], conn);
  if (!message.message) return;
  if (message.key && message.key.remoteJid === 'status@broadcast') return;
  if (message.type === 'protocolMessage' || message.type === 'senderKeyDistributionMessage' || !message.type || message.type === '') return;
  if (!Object.keys(store.groupMetadata).length) {
    store.groupMetadata = await conn.groupFetchAllParticipating(); }
  let { type, body } = message;
  const match = body.trim().split(/ +/).slice(1);
  if (CONFIG.app.mode && !CONFIG.app.mods) return; 
  const iscmd = body.startsWith(CONFIG.app.prefix);
  console.log("------------------\n" + `user: ${message.sender}\nchat: ${message.isGroup ? 'group' : 'private'}\nmessage: ${body || type}\n` + "------------------");
  if (iscmd) {
    const cnd = match[0]; 
    const command = commands.find((c) => c.command.toLowerCase() ==cnd.toLowerCase());
    if (command) {
      try {
        await command.execute(message, conn, match);
      } catch (err) {
        console.error(err);
      }
    }
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
            console.log('Wabot is online now ✅');
        }
    });
}

setTimeout(startBot, 3000);
