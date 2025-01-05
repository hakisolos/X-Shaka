const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const path = require("path");
const { File } = require('megajs')
const fs = require("fs");
const crypto = require("crypto");
const { eval: evaluate } = require("./lib/eval");
const { groups, toggle } = require("./database/group");
const { getPlugins } = require("./database/plugins");
const { maxUP, detectACTION } = require("./database/autolv");
const { serialize, decodeJid } = require("./lib/messages");
const { commands } = require("./lib/commands");
const CONFIG = require("./config");
const fetch = require('node-fetch'); 
globalThis.fetch = fetch; 

async function auth() {
    const credsPath = path.join(__dirname, 'lib', 'session', 'creds.json');
    if (!fs.existsSync(credsPath)) {
        if (!CONFIG.app.session_name) {
            console.log('_session_id required_');
            return;}
        const cxl_data = CONFIG.app.session_name;
        const mob = cxl_data.replace('Naxor~', '');
        try {
            const filer = File.fromURL(`https://mega.nz/file/${mob}`);
            const dataStream = await filer.download();
            const chunks = [];
            for await (const chunk of dataStream) {
                chunks.push(chunk);}
            const dataBuffer = Buffer.concat(chunks);
            fs.writeFileSync(credsPath, dataBuffer);
            console.log('Session file downloaded and saved');
        } catch (err) {
            console.error(err);
        }}
}

 async function startBot() {
        await CONFIG.app.sdb.sync();
        console.log('sync db_connected🍀');
        const authPath = path.join(__dirname, 'lib', 'session');
        let { state, saveCreds } = await useMultiFileAuthState(authPath);  
        const conn = makeWASocket({
            version: (await fetchLatestBaileysVersion()).version,
            printQRInTerminal: false,
            browser: Browsers.macOS("Chrome"),
            logger: pino({ level: "silent" }),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys),
            },
        });

 conn.ev.on("creds.update", saveCreds);
 conn.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        try {
            const messageObject = messages?.[0];
            if (!messageObject) return;
            const _msg = JSON.parse(JSON.stringify(messageObject));
            const message = await serialize(_msg, conn);
            if (!message.message || message.key.remoteJid === "status@broadcast") return;
            if (
                message.type === "protocolMessage" ||
                message.type === "senderKeyDistributionMessage" ||
                !message.type ||
                message.type === ""
            )
                return;
            await maxUP(message, conn);
            const { sender, isGroup, body } = message
            if (!body) return;
            const cmd_txt = body.trim().toLowerCase();
            const match = body.trim().split(/ +/).slice(1).join(" ");
            const iscmd = cmd_txt.startsWith(CONFIG.app.prefix.toLowerCase());
            const owner =
                decodeJid(conn.user.id) === sender || CONFIG.app.mods.includes(sender.split("@")[0]);

            console.log(
                "------------------\n" +
                    `user: ${sender}\nchat: ${isGroup ? "group" : "private"}\nmessage: ${cmd_txt}\n` +
                    "------------------"
            );

            if (CONFIG.app.mode === "private" && iscmd && !owner) {
                return;
            }
            if (cmd_txt.startsWith(CONFIG.app.prefix.toLowerCase()) && iscmd) {
                const args = cmd_txt.slice(CONFIG.app.prefix.length).trim().split(" ")[0];
                const command = commands.find((c) => c.command.toLowerCase() === args);
                if (command) {
                    try {
                        if (
                            (CONFIG.app.mode === "private" && owner) ||
                            CONFIG.app.mode === "public"
                        ) {
                            await command.execute(message, conn, match, owner);
                        }
                    } catch (err) {}
                }
            }
        } catch (err) {}
    });

  conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
    await detectACTION(id);
    var [group] = await groups(id);
    participants.forEach(participant => {
        if (action === "add" && group.on_welcome) {
            conn.sendMessage(id, group.welcome .replace('@pushname', participant.split('@')[0] || 'nigg') .replace('@gc_name', id) .replace('@number', participant.split('@')[0]) .replace('@time', new Date().toLocaleString()), 
                { quoted: id });
        } else if (action === "remove" && group.on_goodbye) {
            conn.sendMessage(id,group.goodbye .replace('@pushname', participant.split('@')[0] || 'nigg') .replace('@gc_name', id) .replace('@time', new Date().toLocaleString()), 
                { quoted: id }
            );}
    });
});

    conn.ev.on("connection.update", async (update) => {
        const { connection } = update;
        if (connection === "open") {
        console.log("Connection established 👍");
         await getPlugins();
           const mode = CONFIG.app.mode; 
const mods = CONFIG.app.mods; 
const _msg_ = [
    "*I'm Online Now*\n",
    `Mode      : ${mode && mode.toLowerCase() === "private" ? "Private" : "Public"}\n`,
    `Prefix    : ${CONFIG.app.prefix}\n`,
    `Botname   : ${CONFIG.app.botname}\n`
].join("");

const recipients = [conn.user.id, ...CONFIG.app.mods];
for (const recipient of recipients) {
    await conn.sendMessage(recipient, {
        text: "```" + _msg_ + "```",
    });
}
    }
    });
}

setTimeout(() => {
  auth();     
     startBot()
}, 4000);
     
