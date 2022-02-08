const { Client } = require("discord.js")

/**
 * 
 * @param {Client} bot 
 */
module.exports = function (bot) {
    console.log(bot.user.tag, 'has started!')
    console.log(bot.generateInvite({ permissions: ['ADMINISTRATOR'], scopes: ['applications.commands', 'bot'] }))
}