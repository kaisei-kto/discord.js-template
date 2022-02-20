const { BaseCommandInteraction } = require('discord.js')
const { CreateSlashCommandOptions } = require('dkto.js')

/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	const content = interaction.options.get("content")

	try {
			await interaction.followUp({ content: `\`\`\`\n${String(eval(String(content.value))).replace(/`+/, '\\`').replace(/\\+/, '\\\\')}\n\`\`\`` })
	} catch (exception) {
			interaction.followUp({ content: `Error:\n\`\`\`\n${String(exception).replace(/`+/, '\\`').replace(/\\+/, '\\\\').substring(0, 2048)}\n\`\`\``})
	}
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
	name: __filename.split(require('path').sep).pop().split('.').shift(),
	description: 'N/A',
	category: __dirname.split(require('path').sep).pop(),
	options: CreateSlashCommandOptions()
		.string({
			name: 'content',
			description: 'The content will be the execution code',
			required: true
		})
	.toJSON()
}

module.exports = { run, config }