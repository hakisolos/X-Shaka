const { CreatePlug } = require('../lib/commands');

CreatePlug({
    command: 'group',
    category: 'group',
    desc: 'Change the group privacy settings',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if(!message.isBotAdmin) return message.reply('_not admin_');
        if (!message.isAdmin) return;
        if (!match || !['open', 'closed'].includes(match)) return message.reply('use "open" or "closed" for the group privacy');
        const setting = match === 'open' ? 'not_announcement' : 'announcement';
        await conn.groupSettingUpdate(message.user, setting);
        message.reply(`Group set: "${match}"`);
    },
});

CreatePlug({
    command: 'clearchat',
    category: 'group',
    desc: 'Clear all messages',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isAdmin) return;
        const data = await conn.groupMetadata(message.user);
        const participants = data.participants;
        for (const participant of participants) {
            await conn.sendMessage(message.user, { delete: { remoteJid: message.user, fromMe: false } });
        }
    },
});

CreatePlug({
    command: 'tagall',
    category: 'group',
    desc: 'taga users',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        var data = await conn.groupMetadata(message.user);
        var participants = data.participants.map(p => p.id.replace('@s.whatsapp.net', ''));
        const msg = `⛊──⛾「 Tag All 」⛾──⛊`;
        const _object = participants.map(p => `@${p}`).join('\n');
        const _m = msg + _object;
        message.reply(_m, {
            mentions: participants.map(p => p + '@s.whatsapp.net')
        });
    },
});

CreatePlug({
    command: 'promote',
    category: 'group',
    desc: 'Promote members',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_not an admin_');
        if (!message.isAdmin) return;
        if (!match) return message.reply('_Please mention the user_');
        let target; 
        if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo) {
            target = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else {
            target = match.includes('@s.whatsapp.net') ? match : match + '@s.whatsapp.net';}
        if (!target) return;
        await conn.groupParticipantsUpdate(message.user, [target], 'promote');
        message.reply(`_promoted_ ${target.replace('@s.whatsapp.net', '')} as admin`);
    },
});

CreatePlug({
    command: 'demote',
    category: 'group',
    desc: 'Demote members',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_um not an admin_');
        if (!message.isAdmin) return;
        if (!match) return message.reply('_Please mention the user_');
        let target;
        if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo) {
        target = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else {
        target = match.includes('@s.whatsapp.net') ? match : match + '@s.whatsapp.net';}
        if (!target) return;
        await conn.groupParticipantsUpdate(message.user, [target], 'demote');
        message.reply(`_demoted_ ${target.replace('@s.whatsapp.net', '')}`);
    },
});
    
CreatePlug({
    command: 'mute',
    category: 'group',
    desc: 'Mute the group',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_not_admin_');
        if (!message.isAdmin) return;
        const data = await conn.groupMetadata(message.user);
        if (data.announce) return message.reply('_The group is already muted_');
        await conn.groupSettingUpdate(message.user, 'announcement');
        message.reply('_The group now_muted_');
    },
});

CreatePlug({
    command: 'unmute',
    category: 'group',
    desc: 'Unmute the group',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_not an admin_');
        if (!message.isAdmin) return;
        const data = await conn.groupMetadata(message.user);
        if (!data.announce) return message.reply('_The group already opened_');
        await conn.groupSettingUpdate(message.user, 'not_announcement');
        },
});

CreatePlug({
    command: 'kick',
    category: 'group',
    desc: 'Remove a member from the group.',
    execute: async (message, conn, match) => {
        if (!message.isGroup) {
            return message.reply('This command can only be used in groups.');
        }

        if (!message.isBotAdmin) {
            return message.reply('I need admin privileges to remove members.');
        }

        if (!message.isAdmin) {
            return message.reply('You need to be a group admin to use this command.');
        }

        if (!match) {
            return message.reply('Please mention or provide the number of the user you want to kick.');
        }
        let target;
        if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo) {
            target = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else {
            target = match.includes('@s.whatsapp.net') ? match : match + '@s.whatsapp.net';
        }

        if (!target) {
            return message.reply('Could not determine the user to remove.');
        }

        try {
            await conn.groupParticipantsUpdate(message.user, [target], 'remove');
            message.reply(`removed ${target.replace('@s.whatsapp.net', '')}.`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to remove the user. Ensure I have the necessary permissions.');
        }
    },
});

CreatePlug({
    command: 'info',
    category: 'group',
    desc: 'Get information about the group',
    execute: async (message, conn) => {
        if (!message.isGroup) return;
        const groupMetadata = await conn.groupMetadata(message.user);
        const name = groupMetadata.subject;
        const desc = groupMetadata.desc;
        const count = groupMetadata.participants.length;
        const img = await conn.profilePictureUrl(message.user);
        await conn.sendMessage(message.user, {
            image: { url: img }, 
            caption: `*Name*: ${name}\n*Members*: ${count}`
        });
    }
});
 
CreatePlug({
    command: 'invite',
    category: 'group',
    desc: 'group_invites',
    execute: async (message, conn, match) => {
        const isAdmin = message.isAdmin;
        if (!isAdmin) return;
        var _invites  = await conn.groupInviteCode(message.user);
        await message.reply(`*Group Link*:\nhttps://chat.whatsapp.com/${_invites}`);
    }
});
        
