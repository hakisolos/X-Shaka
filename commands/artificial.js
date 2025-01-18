const { CreatePlug } = require('../lib/commands');
const { ChatGPT, GeminiAI, SimAI } = require('./downloads/gpt');

CreatePlug({
  command: 'gemini',
  category: 'Artficial',
  desc: 'Ask Gemini AI anything',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a query_');
    var voidi = await GeminiAI(match);
    return message.reply(voidi);
  },
});

CreatePlug({
  command: 'simai',
  category: 'Artficial',
  desc: 'Ask SimAI anything',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a query_');
    var voidi = await SimAI(match);
    return message.reply(voidi);
  },
});

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
