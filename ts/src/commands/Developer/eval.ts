import { BaseCommandInteraction } from 'discord.js'
import { CreateSlashCommandOptions } from 'dkto.js'
import { sep } from 'path'
import { ICOMMAND_CONFIG } from '../../types/ITypes'

async function run (interaction: BaseCommandInteraction) : Promise<any> {
    const content = interaction.options.get("content")

    try {
        await interaction.followUp({ content: `\`\`\`\n${String(eval(String(content?.value))).replace(/`+/, '\\`').replace(/\\+/, '\\\\')}\n\`\`\`` })
    } catch (exception) {
        interaction.followUp({ content: `Error:\n\`\`\`\n${String(exception).replace(/`+/, '\\`').replace(/\\+/, '\\\\').substring(0, 2048)}\n\`\`\``})
    }
}

const config: ICOMMAND_CONFIG = {
	name: __filename.split(sep).pop()?.split('.').shift() as string,
	description: 'N/A',
	category: __dirname.split(sep).pop() as string,

	options: CreateSlashCommandOptions()
		.string({
			name: 'content',
			description: 'The content will be the execution code',
			required: true
		})
	.toJSON()
}

export { run, config }