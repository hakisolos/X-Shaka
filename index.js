const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeInMemoryStore,
    Browsers,
} = require("@whiskeysockets/baileys");
const P = require("pino");
const path = require("path");
const { File } = require("megajs");
const fs = require("fs");
const { getPlugins } = require("./database/plugins");
const { serialize } = require("./lib/messages");
const { commands } = require("./lib/commands");
const CONFIG = require("./config");
const store = makeInMemoryStore({
    logger: P({ level: "silent" }).child({ level: "silent" }),
});

const fetch = require("node-fetch");
globalThis.fetch = fetch;

async function auth() {
    const credz = path.join(__dirname, "lib", "session", "creds.json");
    if (!fs.existsSync(credz)) {
        if (!CONFIG.app.session_name) {
            console.log("_session_id required_");
            return;
        }
        const cxl_data = CONFIG.app.session_name;
        const mob = cxl_data.replace("Naxor~", "");
        try {
            const filer = File.fromURL(`https://mega.nz/file/${mob}`);
            const data_mode = await filer.download();
            const chunks = [];
            for await (const chunk of data_mode) {
                chunks.push(chunk);
            }
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(credz, buf);
            console.log("Session file saved");
        } catch (err) {
            console.error(err);
        }
    }
}
auth();

async function startBot() {
    await CONFIG.app.sdb.sync();
    console.log("Sequelize db_connected ✅");
    const auth_creds = path.join(__dirname, "lib", "session");
    let { state, saveCreds } = await useMultiFileAuthState(auth_creds);
    const conn = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Chrome"),
        syncFullHistory: true,
        emitOwnEvents: true,
        auth: state,
        version: (await fetchLatestBaileysVersion()).version,
    });

    store.bind(conn.ev);
    conn.ev.on("creds.update", saveCreds);
    conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    msg.message = Object.keys(msg.message)[0] === 'ephemeralMessage'
        ? msg.message.ephemeralMessage.message
        : msg.message;
    const message = await serialize(msg, conn);
    if (!message || !message.key || !message.body) {
        console.error(message);
        return;
    }

    const me = conn.user.id;
    if (
        message.sender !== me &&
        ['protocolMessage', 'reactionMessage'].includes(message.type) &&
        message.key.remoteJid === 'status@broadcast'
    ) {
        if (!Object.keys(store.groupMetadata).length) {
            store.groupMetadata = await conn.groupFetchAllParticipating();
        }
        return;
    }

    const mek = message.body.trim();
    const match = mek.slice(1).trim();                                                    
        if (mek.startsWith('>')) {
        if (message.sender !== me || CONFIG.app.mods) return; 
        const code = match;
        let result = eval(code);
        if (result instanceof Promise) result = await result; 
        conn.sendMessage(message.key.remoteJid, `\`\`\`js\n${result}\n\`\`\``, { quoted: message });
    }

    const isCmd = mek.startsWith(CONFIG.app.prefix.toLowerCase());
    if (isCmd) {
        const args = mek.slice(CONFIG.app.prefix.length).trim().split(" ")[0];
        const command = commands.find((c) => c.command.toLowerCase() === args);
        if (command) {
            try {
                await command.execute(message, conn, args, match);
            } catch (err) {
                console.error(err);
            }
        }
    }
});

    conn.ev.on("connection.update", async (update) => {
        const { connection } = update;
        if (connection === "open") {
            console.log("Connection established ✅");
            await getPlugins();
            console.log('Wabot is online now ✅');
        }
    });
}

setTimeout(startBot, 3000);
