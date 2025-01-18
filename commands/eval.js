const CONFIG = require('../config');
const util = require('util');
const { CreatePlug } = require('../lib/commands');

CreatePlug({
  command: 'eval',
  category: 'admin',
  desc: 'JavaScript code (admin only)',
  execute: async (message, conn, match) => {
    const owner = CONFIG.app.mods;
    if (!owner) return;
    if (!match) return message.reply('undefined');
    let result;
    let output;
    result = await eval(`(async () => { ${match} })()`).catch(err => err.message);
    output = typeof result !== 'string' ? util.inspect(result) : result;
    await message.reply(`\`\`\`\n${output}\n\`\`\``);
  }
});
