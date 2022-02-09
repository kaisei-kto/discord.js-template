const { MESSAGES, DEVELOPER_IDS } = require('../constants')
const { Interaction } = require('discord.js')
const cmd_handler = require('../handler/cmds')

/**
 * @param {Interaction} interaction
 */
module.exports = async function(interaction) {
    if (!cmd_handler.initialized) {
        if (interaction.isCommand()) {
            await interaction.deferReply({ fetchReply: false, ephemeral: true })
            await interaction.followUp({ content: "Commands are still loading..." })
        }
        return;
    }
    if (!interaction.isCommand() || interaction.user.bot || !interaction.inGuild()) return;
    
    const cmd = cmd_handler.get_command(interaction.commandName)
    
    if (!cmd) return;
    // ephemeral -> true -> client-message // ephemeral -> false -> server-message
    await interaction.deferReply({ ephemeral: !!cmd.config.ephemeral }).catch(() => void -1)

    if ('permissions' in cmd.config && !cmd_handler.has_permissions(interaction)) return interaction.followUp({ content: MESSAGES.PERMISSION_DENIED, ephemeral: true })
    if ("Developer" === cmd.config.category && DEVELOPER_IDS.indexOf(interaction.user.id) === -1) return interaction.followUp({ content: MESSAGES.PERMISSION_DENIED, ephemeral: true })
    
    cmd.run(interaction)
}