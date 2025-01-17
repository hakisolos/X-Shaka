const { CreatePlug } = require('../lib/commands');
const { TNewsDetails } = require('./downloads/tech');
const { TK } = require('./downloads/Tk');  

CreatePlug({
  command: 'tnews',
  category: 'news',
  desc: 'Get the latest telecom news',
  execute: async (message, conn) => {
    const voidi = await TNewsDetails();
    if (!voidi) return message.reply('_oops_');
    await conn.sendMessage(message.user, {
      image: { url: voidi.image }, caption: `*Telecom News:* ${voidi.title}\nLink: ${voidi.link}\n\nDescription: ${voidi.description}\n\nMade with❣️`
    
    });
  }
});
      
CreatePlug({
  command: 'stalktk',
  category: 'social',
  desc: 'Get TikTok profile details',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a TikTok username_');  
    const p = await TK(match);
    if (!p) return;
    await conn.sendMessage(message.user, {
        image: { url: p.profileImage }, caption: `*Name:* ${p.name}\n*Username:* ${p.username}\n*Followers:* ${p.followers}\n*Following:* ${p.following}\n*Likes:* ${p.likes}\n*Bio:* ${p.bio || 'eish'}`
      
    });
  }
});
  
