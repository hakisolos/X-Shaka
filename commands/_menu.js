const { commands, CreatePlug } = require('../lib/commands');
const { monospace } = require('../lib/monospace');
const CONFIG = require('../config');

CreatePlug({
    command: 'menu',
    category: 'general',
    desc: 'types',
    execute: async (message, conn) => {
        await message.react('🗣️');
        if (!Array.isArray(commands)) {
            await message.reply('not_found');
            return;
        }

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

            return `╭──╼【 ${monospace((CONFIG.app.botname || 'BOT').toUpperCase())} 】\n` +
                   `┃ ✦ Prefix  : ${CONFIG.app.prefix || '/'}\n` +
                   `┃ ✦ User    : ${message.pushName || 'unknown'}\n` +
                   `┃ ✦ Mode    : ${process.env.MODE}\n` +
                   `┃ ✦ Date    : ${date}\n` +
                   `┃ ✦ Time    : ${time}\n` +
                   `┃ ✦ Version : ${CONFIG.app.version || '1.0.0'}\n` +
                   `╰──────────╼`;
        };

        const _cxl = (category, cmds) => {
            return `╭───╼【 *${monospace(category.toUpperCase())}* 】\n` +
                   cmds.map(cmd => `┃ ∘ \`\`\`${cmd.toLowerCase()}\`\`\``).join('\n') + '\n' +
                   `╰──────────╼`;
        };

       let msg = namo() + '\n\n';
        for (const [category, cmds] of Object.entries(gorized)) {
            msg += _cxl(category, cmds) + '\n\n';
        }
        msg += `made with ❣️`;
        const sent = await conn.send(message.user, { text: msg.trim() }, { quoted: message });
        if (!sent) {
            await message.reply('err');
        }
    }
});


CreatePlug({
    command: 'list',
    category: 'general',
    desc: 'Display list',
    execute: async (message, conn) => {   
        const dontAddCommandList = commands
            .map((cmd, index) => `${index + 1}. ${monospace(cmd.command)}`)
            .join('\n');
        await conn.sendMessage(message.user, { text: dontAddCommandList }, { quoted: message });
    }
});
    
