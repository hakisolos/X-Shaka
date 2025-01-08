const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config');

CreatePlug({
    command: 'alive',
    category: 'general',
    desc: 'alive msg',
    execute: async (message, conn, match) => {
        const Alive = require('../database/alive');
        if (match?.startsWith('setalive')) {
            const object = match.replace('setalive', '').trim();
            const format = /^Time: @time\s+Date: @date\s+Runtime: @runtime\s+Message: +/;
            if (!format.test(object)) {
                await message.reply('_Please use the_format:\n\nTime: @time\nDate: @date\nRuntime: @runtime\nMessage: Your alive msg here_');
                return;
            }
            await Alive.setAliveMessage(object);
            await conn.sendMessage(message.user, { text: "Alive set successfully" });
        } else {
            const _msg = await Alive.getAliveMessage();
            await conn.sendMessage(message.user, { text: _msg });
        }
    }
});



CreatePlug({
    command: 'ping',
    category: 'mics',
    desc: 'latency',
    execute: async (message, conn) => {
        const start = Date.now();
        await conn.sendMessage(message.user, { text: 'Pinging!' });
        const end = Date.now();
      //  await message.react('🗣️');
        await conn.sendMessage(message.user, { text: `Pong! ${end - start}ms` });
    }
});
        
