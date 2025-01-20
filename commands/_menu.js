const { commands, haki } = require('../lib/commands');
const { monospace } = require('../lib/monospace');
const CONFIG = require('../config');

haki({
    command: 'menu',
    category: 'general',
    desc: 'types',
    execute: async (message, conn) => {
        await message.react('🗣️');
        if (!Array.isArray(commands)) return;
        const gorized = commands.reduce((acc, cmd) => {
            if (!cmd || !cmd.category || !cmd.command) return acc; // Skip invalid commands
            if (!acc[cmd.category]) acc[cmd.category] = [];
            acc[cmd.category].push(cmd.command);
            return acc;
        }, {});

        const namo = () => {
            const now = new Date();
            const date = now.toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg' });
            const time = now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' });

            return `┏━━【 ${monospace((CONFIG.app.botname || 'BOT').toUpperCase())} 】━━┛\n` +
                   `┃ ⍟ Prefix  : ${CONFIG.app.prefix || '/'}\n` +
                   `┃ ⍟ User    : ${message.pushName || 'unknown'}\n` +
                   `┃ ⍟ Mode    : ${process.env.MODE}\n` +
                   `┃ ⍟ Date    : ${date}\n` +
                   `┃ ⍟ Time    : ${time}\n` +
                   `┃ ⍟ Version : ${CONFIG.app.version || '4.0.0'}\n` +
                   `┛━━━━━━━━━━━━━━━━━━━━━┛`;
        };

        const _cxl = (category, cmds) => {
            return `┏━━【 ${monospace(category.toUpperCase())} 】━━┛\n` +
                   cmds.map(cmd => `┃ → \`\`\`${cmd.toLowerCase()}\`\`\``).join('\n') + '\n' +
                   `┛━━━━━━━━━━━━━━━━━━━━━┛`;
        };

        let msg = namo() + '\n\n';
        for (const [category, cmds] of Object.entries(gorized)) {
            msg += _cxl(category, cmds) + '\n\n';
        }
        msg += `┏━┛ Made with ❣️ ┛`;

        // Replace this with the path to your image or the URL
        const imagePath = 'https://files.catbox.moe/8p7zpk.jpg'; // You can use an URL as well

        // Send the image along with the text as the caption
        const sent = await conn.sendMessage(message.user, { 
            image: { url: imagePath }, // Use a URL for remote images or path for local images
            caption: msg.trim() // Caption text (menu message)
        }, { quoted: message });

        if (!sent) {
            await message.reply('Oops! Something went wrong.');
        }
    }
});

haki({
    command: 'list',
    category: 'general',
    desc: 'Display commands list_',
    execute: async (message, conn) => {
        await message.react('📝');
        if (!Array.isArray(commands)) return;
        let _cmd = `\`\`\`*Commands List:*\n\n\`\`\``;
        commands.forEach(cmd => {
        _cmd += `\`\`\`∘ ${cmd.command.toLowerCase()}\n\n${cmd.desc}\n\`\`\``;});
        const sent = await conn.sendMessage(message.user, { text: _cmd.trim() }, { quoted: message });
        if (!sent) {
            await message.reply('err');
        }
    }
});

                                                                                 
