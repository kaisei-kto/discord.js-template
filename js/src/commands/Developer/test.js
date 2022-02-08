const { BaseCommandInteraction, APIApplicationCommandStringOption } = require('discord.js')
const { get_commands, reload_command } = require('../../handler/cmds')
const { mentions } = require('../../handler/interaction')
/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
    interaction.followUp('boome gr')

    console.log(mentions.roles(interaction))
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(require('path').sep).pop(),

    /**
     * @type {import('discord.js').ApplicationCommandOption[]}
     */
    options: [
        {
            type: require('../../types/ICommandOptionType').MENTIONABLE,
            name: "mention",
            description: "Mention a user or a role",
            required: true
        }
    ]
}

module.exports = { run, config }