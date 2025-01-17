const axios = require('axios');
const { CreatePlug } = require('../lib/commands');

const models = ["yanzgpt-revolution-25b-v3.5", "yanzgpt-legacy-72b-v3.5"];
exports.YanzGPT = (query, prompt, model = models[0]) =>
  axios("https://api.yanzgpt.my.id/v1/chat", {
    method: "POST",
    headers: {
      authorization: "Bearer yzgpt-sc4tlKsMRdNMecNy",
      "content-type": "application/json"
    },
    data: {
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: query }
      ],
      model
    }
  }).then(res => res.data);

CreatePlug({
  command: 'gpt',
  category: 'AI',
  desc: 'ai',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_need a prompt_');
    exports.YanzGPT(match, "You are a helpful assistant", models[0])
      .then(response => conn.sendMessage(message.user, { text: response, quoted: message }))
      .catch(() => conn.sendMessage(message.user, { text: '_Error_', quoted: message }));
  }
});
  
