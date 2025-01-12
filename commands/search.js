var { CreatePlug } = require('../lib/commands');
const axios = require('axios');
const cheerio = require('cheerio');

CreatePlug({
    command: 'wiki',
    category: 'search',
    desc: 'Search Wikipedia',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_Please provide a search term_');
        const url = `https://en.wikipedia.org/wiki/${match}`;
        const res = await axios.get(url).catch((err) => {
          console.error(err);
            message.reply('_Err_');
          return null; });
         if (res) {
            const $ = cheerio.load(res.data);
            const first = $('#mp-upper .mp-upper').text().split('\n')[0]; 
            const titles = $('h1#firstHeading').text(); 
            const postec = new Date().toLocaleDateString(); 
            const msg = `*Title:* ${titles} \n${first} \n*Posted:* ${posted} \n\nvisit: https://en.wikipedia.org/wiki/${match}`;
            message.reply(msg);
        }
    }
});
          
