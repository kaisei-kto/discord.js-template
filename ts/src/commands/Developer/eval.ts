import { BaseCommandInteraction } from 'discord.js'
import { sep } from 'path'
import { ICommandOptionType } from '../../types/ICommandOptionType'
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
	// @ts-ignore
    name: __filename.split(sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(sep).pop() as string,
	
    options: [
        {
			// @ts-ignore
            type: ICommandOptionType.STRING,
            name: "content",
            description: "The content will be the execution code",
            required: true
        }
    ]
}

export { run, config }