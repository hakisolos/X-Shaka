const { CreatePlug } = require('../lib/commands');
const User = require('../database/alive');

CreatePlug({
    command: 'alive',
    category: 'general',
    desc: 'alive',
    execute: async (message, conn) => {
        //await message.react('🗣️');
        const _user = await User.findOne({ where: { id: message.user } });
        const msg = _user ? _user.generateAliveMessage() : '_not active_';   
        await conn.sendMessage(message.user, { text: msg });
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
        
