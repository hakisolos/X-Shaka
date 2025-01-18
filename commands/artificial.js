const { CreatePlug } = require('../lib/commands');
const { ChatGPT } = require('./downloads/gpt');

CreatePlug({
  command: 'ai',
  category: 'Artficial',
  desc: 'Ask ChatGPT anything',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a prompt_');
    await message.react('🗣️');
    var voidi = await ChatGPT(match);
    return message.reply(voidi);
  },
});
