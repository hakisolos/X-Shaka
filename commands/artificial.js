const { CreatePlug } = require('../lib/commands');
const { ChatGPT, GeminiAI } = require('./downloads/gpt');

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

const axios = require('axios');
const model = [
    "yanzgpt-revolution-25b-v3.5", 
    "yanzgpt-legacy-72b-v3.5" 
];

const GPT4o = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios("https://api.yanzgpt.my.id/v1/chat", {
                headers: {
                    authorization: "Bearer yzgpt-sc4tlKsMRdNMecNy",
                    "content-type": "application/json"
                },
                data: {
                    messages: [
                        {
                            role: "user",
                            content: query
                        }
                    ],
                    model: "yanzgpt-revolution-25b-v3.5"
                },
                method: "POST"
            });
            resolve(response.data.choices[0].message.content);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

