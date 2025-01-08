const CONFIG = require('../config');
const { DataTypes } = require('sequelize');
const os = require('os');

const Alive = CONFIG.app.sdb.define('alive', {
    alives: { 
        type: DataTypes.STRING,
        defaultValue: `Bot Status:\n\nPlatform: {{platform}}\nUptime: {{uptime}}\nMemory Usage: {{memoryUsage}}\n\nI'm alive now 💘`,
    },
});

const formatMessage = function(message) {
    const platform = os.platform();
    const uptime = `${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s`;
    const memoryInMB = (os.totalmem() - os.freemem()) / (1024 * 1024);
    const memoryUsage = `${memoryInMB.toFixed(2)}MB`;
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    const runtime = uptime;

    return message
        .replace('{{platform}}', platform)
        .replace('{{uptime}}', uptime)
        .replace('{{memoryUsage}}', memoryUsage)
        .replace('@time', time)
        .replace('@date', date)
        .replace('@runtime', runtime);
};

const getAliveMessage = async function() {
    const aliveInstance = await Alive.findOne();
    const message = aliveInstance?.alives || Alive.rawAttributes.alives.defaultValue;
    return formatMessage(message); 
};

const setAliveMessage = async function(newMessage) {
    const [aliveInstance] = await Alive.findOrCreate({ where: { id: 1 } });
    aliveInstance.alives = newMessage;
    await aliveInstance.save();
    return 'Alive message updated'; 
};

Alive.formatMessage = formatMessage;
Alive.getAliveMessage = getAliveMessage;
Alive.setAliveMessage = setAliveMessage;

module.exports = Alive;
        
