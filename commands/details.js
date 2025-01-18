const { CreatePlug } = require('../lib/commands');
const { TNewsDetails } = require('./downloads/tech');
const { TK } = require('./downloads/Tk');  
const { PlaySearch } = require('./downloads/Play');

CreatePlug({
  command: 'playstore',
  category: 'search',
  desc: 'Search for apps in the Play Store',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a search query_');
    var results = await PlaySearch(match);
    if (results.length === 0) return;
    const voidi = results.slice(0, 5).map(app => 
      `*${app.name}*\nDeveloper: ${app.developer}\nRating: ${app.rating}\n[Install](${app.link})\n[Developer Page](${app.developerPage})\n\nMade with❣️`
    ).join('\n\n');
    return message.reply(voidi);
  },
});

CreatePlug({
  command: 'tnews',
  category: 'news',
  desc: 'Get the latest telecom news',
  execute: async (message, conn) => {
    await message.react('🗣️');
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


