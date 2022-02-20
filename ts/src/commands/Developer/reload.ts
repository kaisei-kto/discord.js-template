import { BaseCommandInteraction } from "discord.js"
import { sep } from "path"
import { reload_command } from "../../handler/cmds"
import { ICOMMAND_CONFIG } from "../../types/ITypes"
import { CreateSlashCommandOptions } from 'dkto.js';

async function run (interaction: BaseCommandInteraction) : Promise<any> {
    reload_command(interaction.client, String(interaction.options.get('command_name')?.value))
    interaction.followUp({ content: `${String(interaction.options.get('command_name')?.value)} has been reloaded` })
}

const config: ICOMMAND_CONFIG = {
	name: __filename.split(sep).pop()?.split('.').shift() as string,
	description: 'N/A',
	category: __dirname.split(sep).pop() as string,
	ephemeral: true,

	options: CreateSlashCommandOptions()
		.string({
			name: 'command_name',
			description: 'N/A',
			required: true
		})
	.toJSON()
}

export { run, config }