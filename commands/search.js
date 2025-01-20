const { CreatePlug } = require('../lib/commands');
const { getSpotifyBangers, getAppRuntime } = require('./downloads/apis'); 

CreatePlug({
  command: 'spotifys',
  category: 'search',
  desc: 'Fetches Spotify tracks based on a query',
  execute: async (message, conn, match) => {
    await message.react('🎵');
    if (!match) return message.reply('Provide a query to search for tracks');
    const tracks = await getSpotifyBangers(match);
    if (tracks.length === 0) return;
    const voidi = tracks.map(track => `🎧 *${track.songTitle}*\n👤 Artist: ${track.artist}\n💿 Album: ${track.album}\n⏱️ Duration: ${track.length}\n🔗 [Listen]: ${track.link}\n\nMade with❣️`).join('\n\n');
    await message.reply(voidi);
  },
});

CreatePlug({
  command: 'runtime',
  category: 'mics',
  desc: 'Displays the app runtime',
  execute: async (message, conn) => {
    await message.react('⏳');
    const { runtime } = await getAppRuntime();
    await message.reply(`*Runtime: ${runtime}`);
  },
});
