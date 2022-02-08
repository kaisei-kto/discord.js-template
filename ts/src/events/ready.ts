import { Client } from "discord.js"

export default function (bot: Client) {
    console.log(bot.user?.tag, 'has started!')
    console.log(bot.generateInvite({ permissions: ['ADMINISTRATOR'], scopes: ['applications.commands', 'bot'] }))
}