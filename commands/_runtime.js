const { CreatePlug } = require('../lib/commands');
const { runtime } = require('../lib/functions');

CreatePlug({
    command: 'runtime',
    category: 'mics',
    desc: 'Shows bot runtime',
    execute: async (message, conn) => {
        await message.react('🗣️');
        const uptime = process.uptime();
        const txt = await runtime(uptime);
        await message.reply(`\`\`\`Bot uptime: ${txt}\`\`\``); 
    }
});
