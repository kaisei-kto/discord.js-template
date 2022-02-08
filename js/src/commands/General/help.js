const { BaseCommandInteraction, MessageEmbed } = require('discord.js')
const { EMBED_COLORS } = require('../../constants')
const { get_commands } = require('../../handler/cmds')
/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
    const commands = {}
    for (const command of get_commands()) {
        commands[command.config.category] = [...(command.config.category in commands ? commands[command.config.category] : []), command.config.name]
        commands[command.config.category].sort((a,b)=>a.localeCompare(b))
    }

    interaction.followUp({ embeds: [
        new MessageEmbed()
            .setTitle('Slash Commands List')
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setColor(EMBED_COLORS.BASE)
            .addFields(...Object.keys(commands).sort((a,b)=>a.localeCompare(b)).map(name => {
                return {
                    name,
                    value: commands[name].join(', '),
                    inline: false
                }
            }))
    ] })
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(require('path').sep).pop(),
    ephemeral: true
}

module.exports = { run, config }