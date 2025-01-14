const CONFIG = require('../config');
const { DataTypes } = require('sequelize');

const WarnDB = CONFIG.app.sdb.define('warns', {
    userId: { type: DataTypes.STRING, allowNull: false, },
    groupId: { type: DataTypes.STRING, allowNull: false, },
    warnings: { type: DataTypes.INTEGER, defaultValue: 0, },}, 
    {timestamps: false,
});
module.exports = WarnDB;
                                     
