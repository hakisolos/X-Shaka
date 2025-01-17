const { serialize } = require('../lib/messages');
const CONFIG = require('../config');
const message = await serialize(msg);
const { body } = message;
const owner = CONFIG.app.mods;
if (body.startsWith('$')) {
  if (!owner.includes(message.sender)) return;
  const code = body.slice(1).trim();
  const result = await eval(code);
  message.reply(`\`\`\`\n${result}\n\`\`\``);
    }
