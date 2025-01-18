const fetch = require('node-fetch');

async function ChatGPT(input) {
  var url = `https://api.rendigital.store/endepoin/chatgpt?input=${input}`;
  var voidi = await fetch(url);
  var data = await voidi.json();
  if (!data.status) throw new Error('err');
  return data.content;
}

module.exports = { ChatGPT };
