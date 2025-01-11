const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeInMemoryStore,
    Browsers,
} = require("@whiskeysockets/baileys");
const P = require("pino");
const path = require("path");
const fs = require("fs");
const { File } = require("megajs");
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
    console.log("Sequelize connected ✅");
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
            return;
        }
        const me = message.key.remoteJid;
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

        if (CONFIG.app.mode === true && !message.isowner) return;

        const mek = message.body.trim().toLowerCase();
        const iscmd = mek.startsWith(CONFIG.app.prefix.toLowerCase());

        console.log("------------------\n" +`user: ${message.sender}\nchat: ${message.isGroup ? "group" : "private"}\nmessage: ${mek}\n` +"------------------");

        if (iscmd) {
            // Step 1: Extract command name and query
            const args = mek.slice(CONFIG.app.prefix.length).trim().split(/ +/); // Split by spaces
            const commandName = args[0].toLowerCase(); // Command name is the first argument
            const match = args.slice(1).join(" "); // The rest is the query

            // Step 2: Find the matching command from your list of commands
            const command = commands.find((c) => c.command.toLowerCase() === commandName);

            if (command) {
                try {
                    // Step 3: Execute the command
                    if (match || command.requiresQuery === false) {
                        // If the command requires no query or has a valid match
                        await command.execute(message, conn, commandName, match);
                    } else {
                        // If the command expects a query but no query is provided
                        await conn.sendMessage(message.key.remoteJid, { text: `This command requires a query. Example usage: ${CONFIG.app.prefix}${commandName} <query>` });
                    }
                } catch (err) {
                    console.error("Error executing command:", err);
                }
            } else {
                // If no matching command is found
                console.log(`No command found for: ${commandName}`);
            }
        }
    });

    conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
        const time = new Date().toLocaleTimeString();
        for (let participant of participants) {
            const img = await conn.profilePictureUrl(participant, "image");
            let message = "";
            if (action === "add") message = `_Welcome mate_ ${participant}\n _Time_: ${time}`;
            else if (action === "remove") message = `_Until next time mate_ ${participant}\n_Time_: ${time}`;
            else if (action === "promote") message = `_Congrats_ ${participant}\n _Youve been promoted_`;
            else if (action === "demote") message = `${participant}\n_Youve been demoted_`;

            if (message) {
                await conn.sendMessage(id, { 
                    text: message, 
                    image: { url: img },
                    caption: message 
                });
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
