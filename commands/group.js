const { CreatePlug } = require('../lib/commands');

CreatePlug({
    command: 'kick',
    category: 'group',
    desc: 'Kick members by country code or kick all members',
    execute: async (message, conn, match) => {
        if (!message.isGroup || !message.isBotAdmin || !message.isAdmin) return;
        const arg = match[1];
        if (arg === 'all') {
            const { participants } = await conn.groupMetadata(message.user);
            const com = participants.filter(member => !member.admin && member.id !== conn.user.id);
            if (com.length === 0) return;
            for (const user of com) {
                await conn.groupParticipantsUpdate(message.user, [user.id], 'remove');
                await new Promise(resolve => setTimeout(resolve, 500)); }
            return message.reply(`${arg.length} _user(s) removed_`); }
          if (!arg || isNaN(arg.replace('+', ''))) {
            return message.reply('Please provide a valid country code (e.g., `kick +27`).');}
        const { participants } = await conn.groupMetadata(message.user);
        const cam = participants.filter(member => member.id.split('@')[0].startsWith(arg.replace('+', '')));
        if (cam.length === 0) return;
        for (const user of cam) {
            await conn.groupParticipantsUpdate(message.user, [user.id], 'remove');
            await new Promise(resolve => setTimeout(resolve, 500)); }
        return message.reply(`${cam.length} _user(s) removed_`);
    },
});
                    
/*CreatePlug({
    command: 'kickall',
    category: 'group',
    desc: 'kick all_',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if(!message.isBotAdmin) return;
        if (!message.isAdmin) return;
        const memb = await conn.groupMetadata(message.user);
        const part = memb.participants.filter(member => !member.admin);
        const parti = part.map(member => member.id);
        if (parti.length === 0) return;
        for (let i = 0; i < parti.length; i++) {
            await conn.groupParticipantsUpdate(message.user, [parti[i]], 'remove');
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
    },
});*/

CreatePlug({
    command: 'lockinvite',
    category: 'group',
    desc: 'Lock the group invite',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if(!message.isBotAdmin) return message.reply('_um not admin_');
        if (!message.isAdmin) return;
        await conn.groupSettingUpdate(message.user, 'locked');
        message.reply('_Done_');
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
        const messages = await conn.loadMessages(message.user, 100);
        for (const msg of messages) {
            if (msg.key.fromMe) continue;
            await conn.sendMessage(message.user, { delete: { remoteJid: message.user, fromMe: false, messageId: msg.key.id } });
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
        const msg = `⛊──⛾「 Tag All 」⛾──⛊\n`;
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
    command: 'remove',
    category: 'group',
    desc: 'Remove a member from the group',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_um not admin_');
        if (!message.isAdmin) return;
        if (!match) return message.reply('_Please mention a member_');
        let target = message.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || (match.includes('@s.whatsapp.net') ? match : match + '@s.whatsapp.net');
        if (!target) return;
        await conn.groupParticipantsUpdate(message.user, [target], 'remove')
            .then(() => message.reply(`_removed_ ${target.replace('@s.whatsapp.net', '')}`))
            .catch((error) => { 
                console.error(error); 
                message.reply('err'); 
            });
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

CreatePlug({
    command: 'setname',
    category: 'group',
    desc: 'Change the group name',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if(!message.isBotAdmin) return;
        if (!message.isAdmin) return;
        if (!match) return message.reply('_Please provide a name_');
        await conn.groupUpdateSubject(message.user, match);
        message.reply(`_Group name_: "${match}"`);
    },
});

CreatePlug({
    command: 'gcpp',
    category: 'group',
    desc: 'Set a new group icon',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if(message.isBotAdmin); return;
        if (!message.isAdmin) return;
        if (!match) return message.reply('_Please send the image_');
        const media = await conn.downloadMediaMessage(message);
        await conn.updateProfilePicture(message.user, media);
        message.reply('Group pp update');
    },
});
                               
