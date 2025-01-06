const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
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
const { maxUP, detectACTION } = require("./database/autolv");
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

    conn.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;

        const messageObject = messages?.[0];
        if (!messageObject) return;

        try {
            const _msg = JSON.parse(JSON.stringify(messageObject));
            const message = await serialize(conn, _msg, store);

            if (!message.message || message.key.remoteJid === "status@broadcast") return;
            if (
                message.type === "protocolMessage" ||
                message.type === "senderKeyDistributionMessage" ||
                !message.type ||
                message.type === ""
            ) {
                if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0)
                    store.groupMetadata = await conn.groupFetchAllParticipating();
                return;
            }

            await maxUP(message, conn);
            const { sender, isGroup, body } = message;
            if (!body) return;

            const match = body.trim().split(/ +/).slice(1).join(" ");
            console.log(
                "------------------\n" +
                    `user: ${sender}\nchat: ${isGroup ? "group" : "private"}\nmessage: ${match}\n` +
                    "------------------"
            );

            if (CONFIG.app.mode === "true" && !message.isOwner) return;

            const _com = body.trim().split(/ +/).slice(1).join(" ");
            if (typeof _com === "string") {
                const command = commands.find((c) => c.command.toLowerCase() === _com.toLowerCase());
                if (message.prefix && typeof body === "string" && body.startsWith(message.prefix)) {
                    const FromPrefix = body.substring(message.prefix.length).trim().split(" ")[0];
                    if (typeof FromPrefix === "string") {
                        const command = commands.find(
                            (c) => c.command.toLowerCase() === FromPrefix.toLowerCase()
                        );
                        if (command) {
                            await command.execute(message, conn, match);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error processing message:", err);
        }
    });

    conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
        await detectACTION(id);
        const [group] = await groups(id);

        participants.forEach((participant) => {
            if (action === "add" && group.on_welcome) {
                conn.sendMessage(
                    id,
                    group.welcome
                        .replace("@pushname", participant.split("@")[0] || "Guest")
                        .replace("@gc_name", id)
                        .replace("@number", participant.split("@")[0])
                        .replace("@time", new Date().toLocaleString()),
                    { quoted: id }
                );
            } else if (action === "remove" && group.on_goodbye) {
                conn.sendMessage(
                    id,
                    group.goodbye
                        .replace("@pushname", participant.split("@")[0] || "Guest")
                        .replace("@gc_name", id)
                        .replace("@time", new Date().toLocaleString()),
                    { quoted: id }
                );
            }
        });
    });

    conn.ev.on("connection.update", async (update) => {
        const { connection } = update;
        if (connection === "open") {
            console.log("Connection established ✅");
            await getPlugins();

            const mode = CONFIG.app.mode;
            const _msg_ = [
                "*I'm Online Now*\n",
                `Mode      : ${mode && mode.toLowerCase() === "private" ? "Private" : "Public"}\n`,
                `Prefix    : ${CONFIG.app.prefix}\n`,
                `Botname   : ${CONFIG.app.botname}\n`,
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
    startBot();
}, 3000);
