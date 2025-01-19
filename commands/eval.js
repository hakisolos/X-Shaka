const CONFIG = require('../config');
const util = require('util');
const { CreatePlug } = require('../lib/commands');

CreatePlug({
  command: 'eval',
  category: 'admin',
  desc: 'Evaluate JavaScript code (admin only).',
  execute: async (message, conn, match) => {
    const owner = CONFIG.app.mods;
    if (!owner) return;
    if (!match) return message.reply('undefined');
    const result = await eval(match);
    const output = typeof result !== 'string' ? util.inspect(result) : result;
    message.reply(`\`\`\`\n${output}\n\`\`\``);
  }
});
