const { CreatePlug } = require('../lib/commands');
const { googleSearch } = require('../lib/scrappers');
    
CreatePlug({
    command: 'google',
    category: 'search',
    desc: 'Search on Google',
    execute: async (message, conn, args) => {
        if (!args) return message.reply('_Please provide a query to search_');
        const results = await googleSearch(args).catch(() => null);
        if (!results) return;
        if (results.length === 0) return message.reply('_oops_');
        let txt = '*Google Search Results:*\n\n';
        results.slice(0, 5).forEach((result, index) => {
            txt += `*${index + 1}. ${result.title}*\n`;
            txt += `Link: ${result.link}\n`;
            if (result.description) {
                txt += `Description: ${result.description}\n`;
            }
            txt += '\n';
        });
        conn.sendMessage(message.user, { text: txt });
    }
});
