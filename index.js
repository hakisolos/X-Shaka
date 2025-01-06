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
const { maxUP, detectACTION } = require("./database/autolv");
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




    store.bind(conn.ev);
    await Client({ conn, store });
    conn.ev.on("creds.update", saveCreds);
    conn.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        const messageObject = messages?.[0];
        if (!messageObject || !messageObject.message) return;
        try {
            const message = await serialize(conn, messageObject, store);
            if (!message.message || message.user === "status@broadcast") return;
            if (message.type === "protocolMessage" || message.type === "senderKeyDistributionMessage") {
                if (!Object.keys(store.groupMetadata).length) {
                    store.groupMetadata = await conn.groupFetchAllParticipating();
                }
                return;
            }

            await maxUP(message, conn);
            const { user, isGroup, body } = message;
            if (!body) return;
            console.log(
                `\nUser: ${user}\nChat: ${isGroup ? "Group" : "Private"}\nMessage: ${body.trim()}\n`
            );
            if (CONFIG.app.mode === "true" && !message.isOwner) return;
            const commandName = body.slice(message.prefix.length).trim().split(" ")[0];
            const command = commands.find((cmd) => cmd.command.toLowerCase() === commandName.toLowerCase());
            if (command) {
                await command.execute(message, conn, body.split(" ").slice(1).join(" "));
            }
        } catch (err) {
            console.error(err);
        }
    });

    conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
        await detectACTION(id);
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

            const message = [
                "*Im Online Now*\n",
                `Mode      : ${CONFIG.app.mode}\n`,
                `Prefix    : ${CONFIG.app.prefix}\n`,
                `Botname   : ${CONFIG.app.botname}\n`,
            ].join("");

            const recipients = [conn.user.id, ...CONFIG.app.mods];
            for (const recipient of recipients) {
                await conn.sendMessage(recipient, { text: "```" + message + "```" });
            }
        }
    });
}

setTimeout(startBot, 3000);
