const { CreatePlug } = require('../lib/commands');
              
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
        
