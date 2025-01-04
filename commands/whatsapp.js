const { CreatePlug } = require('../lib/commands');
const { toggle } = require('../database/group');

CreatePlug({
    command: 'gc',
    category: 'group',
    desc: 'Enable & disable',
    execute: async (message, conn, match, owner) => {
        var ongroup = message.isGroup;
        if(!ongroup) return;
        if(!owner) return;
        if (match.length < 2) return message.reply('usage: gc <welcome/goodbye> <on/off>');
        const feature = args[0].toLowerCase() === 'welcome' ? 'on_welcome' : args[0].toLowerCase() === 'goodbye' ? 'on_goodbye' : null;
        const state = args[1].toLowerCase() === 'on';
        if (!feature) return;
        await toggle(message.user, feature, state);
        message.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} gc_events_now ${state ? 'enabled' : 'disabled'}`);
    }
});
          
