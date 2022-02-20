const { BaseCommandInteraction } = require('discord.js')
const { CreateSlashCommandOptions } = require('dkto.js')
const { reload_command } = require('../../handler/cmds')
/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	reload_command(interaction.client, interaction.options.get('command_name').value)
	interaction.followUp({ content: `${interaction.options.get('command_name').value} has been reloaded` })
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
	name: __filename.split(require('path').sep).pop().split('.').shift(),
	description: 'N/A',
	category: __dirname.split(require('path').sep).pop(),
	ephemeral: true,

	options: CreateSlashCommandOptions()
		.string({
			name: 'command_name',
			description: 'N/A',
			required: true
		})
	.toJSON()
}

module.exports = { run, config }