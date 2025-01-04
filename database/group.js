const CONFIG = require('../config');
const { DataTypes } = require('sequelize');

const Group = CONFIG.app.sdb.define('Group', {
    id: { type: DataTypes.STRING, primaryKey: true },
    welcome: { type: DataTypes.STRING, defaultValue: "*Welcome*: @pushname\n*To*: @gc_name\n*Member*: @number\n*Time*: @time" },
    goodbye: { type: DataTypes.STRING, defaultValue: "*Goodbye*: @pushname\n*From*: @gc_name\n*Time*: @time\n*Negro dusted*" },
    on_welcome: { type: DataTypes.BOOLEAN, defaultValue: true }, 
    on_goodbye: { type: DataTypes.BOOLEAN, defaultValue: true }  
}, { timestamps: false });
async function groups(id) {
return await Group.findOrCreate({ where: { id } });}
async function toggle(gc_id, feature, state) {
    const [group] = await groups(gc_id);
    if (!['on_welcome', 'on_goodbye'].includes(feature)) {
    throw new Error('Invalid');}
    group[feature] = state;
    await group.save();
    return group;
}

module.exports = { groups, toggle };
