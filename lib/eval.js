const util = require("util");
const CONFIG = require('../config'); 

async function evaluate(match, message, conn) {
    if (!CONFIG.app.mods.includes(message.user) && message.user !== conn.user.id) {
        return null;
    }
    try {
        let evaled = await eval(match.slice(2));
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        await message.reply(evaled);
        return message;
    } catch (err) {
        console.error(`(>) error: ${err.message}`);
        await message.reply(`(>) err:\n${err.message}`);
        return null;
    }
}

module.exports = {
    eval: evaluate,
};

