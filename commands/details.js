const { CreatePlug } = require('../lib/commands');
const { TNewsDetails } = require('./downloads/tech');

CreatePlug({
  command: 'tnews',
  category: 'news',
  desc: 'Get the latest telecom news',
  execute: async (message, conn) => {
    const voidi = await TNewsDetails();
    if (!voidi) return message.reply('_oops_');
    await conn.sendMessage(message.user, {
      text: `*Telecom News:* ${voidi.title}\nLink: ${voidi.link}\nDescription: ${voidi.description}\n*Owner:* ${voidi.owner}`,
      image: { url: voidi.image }
    });
  }
});
      
