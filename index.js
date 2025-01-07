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
const crypto = require("crypto");
const { eval: evaluate } = require("./lib/eval");
const { groups, toggle } = require("./database/group");
const { getPlugins } = require("./database/plugins");
const { announcementi } = require("./database/autolv");
const { serialize, Client } = require("./lib/messages");
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
    await Client({ conn, store });
    conn.ev.on("creds.update", saveCreds);
    conn.ev.on('messages.upsert', async ({ messages }) => {
    const asena = messages[0];
    if (!asena.message) return;
    const message = await serialize(conn, asena, store);
    if (!message || !message.key) {
        console.error("Invalid message:", message);
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
    if (!message.prefix) return;
    const cmdName = message.command.toLowerCase();
    if (CONFIG.app.mode === "true" && !message.isOwner) return;
    const command = commands.find((cmd) => cmd.command.toLowerCase() === cmdName);
    if (command) {
        try {
            const match = message.args.join(' ');
            await command.execute(message, conn, match);
        } catch (err) {
            console.error(err);
        }
    } else {}
});
                                    
    conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
        await announcementi(id);
        const [group] = await groups(id);
        for (const participant of participants) {
            const username = participant.split("@")[0] || "Guest";
            if (action === "add" && group.on_welcome) {
                await conn.sendMessage(
                    id,
                    group.welcome
                        .replace("@pushname", username)
                        .replace("@gc_name", id)
                        .replace("@number", username)
                        .replace("@time", new Date().toLocaleString())
                );
            } else if (action === "remove" && group.on_goodbye) {
                await conn.sendMessage(
                    id,
                    group.goodbye
                        .replace("@pushname", username)
                        .replace("@gc_name", id)
                        .replace("@time", new Date().toLocaleString())
                );
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
