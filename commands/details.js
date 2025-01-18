const { CreatePlug } = require('../lib/commands');
const { TNewsDetails } = require('./downloads/tech');
const { TK } = require('./downloads/Tk');  
const { PlaySearch } = require('./downloads/Play');
var { AnimeS } = require('./downloads/anime');

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
    await conn.sendMessage(message.user, { image: { url: app.image }, caption:voidi});
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

CreatePlug({
  command: 'animesh', 
  category: 'Anime',
  desc: 'Search for anime details',
  execute: async (message, conn, match) => {
    await message.reply('🗣️');
    if(!match) return message.reply('_Please provide the name of the anime_');
    const voidi = await AnimeS(match, 'anime');
    const res = ` **Anime Title**: ${voidi.title}\n\n**Episodes**: ${voidi.episodes}\n**Status**: ${voidi.status}\n**Genres**: ${voidi.genres.join(', ')}\n**Season**: ${voidi.season}\n**Description**: ${voidi.description}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: voidi.coverImage }, 
      caption: res
    });
  }
});

CreatePlug({
  command: 'charactersh',  
  category: 'Anime',
  desc: 'Search for character details',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if(!match) return message.reply('_Please provide the name of the character_');
    const voidi = await AnimeS(match, 'character');
    const res = `**Character Name**: ${voidi.name}\n**Native Name**: ${voidi.nativeName}\n**Description**: ${voidi.description}\n**Favourites**: ${voidi.favourites}\n**Appears In**: ${voidi.media.map((media) => media.title).join(', ')}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: voidi.image.large }, 
      caption: res
    });
  }
});

CreatePlug({
  command: 'mangash',  
  category: 'Anime',
  desc: 'Search for manga details',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if(!match) return message.reply('_Please provide the name of the manga_');
    const magas = await AnimeS(match, 'manga');
    const res = `**Manga Title**: ${magas.title}\n**Chapters**: ${magas.chapters}\n**Volumes**: ${magas.volumes}\n**Status**: ${magas.status}\n**Genres**: ${magas.genres.join(', ')}\n**Start Date**: ${magas.startDate}\n**End Date**: ${magas.endDate}\n**Description**: ${magas.description}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: magas.coverImage.large }, 
      caption: res
    });
  }
});
      
