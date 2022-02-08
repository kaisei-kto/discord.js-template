import { BaseCommandInteraction } from "discord.js"
import { sep } from "path"
import { reload_command } from "../../handler/cmds"
import { ICommandOptionType } from "../../types/ICommandOptionType"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

async function run (interaction: BaseCommandInteraction) : Promise<any> {
    reload_command(interaction.client, String(interaction.options.get('command_name')?.value))
    interaction.followUp({ content: `${String(interaction.options.get('command_name')?.value)} has been reloaded` })
}

const config: ICOMMAND_CONFIG = {
	// @ts-ignore
    name: __filename.split(sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(sep).pop() as string,
    ephemeral: true,

    options: [
        {
			// @ts-ignore
            type: ICommandOptionType.STRING,
            name: "command_name",
            description: "N/A",
            required: true
        }
    ]
}

export { run, config }