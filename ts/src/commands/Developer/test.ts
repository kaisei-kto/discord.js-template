import { BaseCommandInteraction } from "discord.js"
import { sep } from "path"
import { mentions } from "../../handler/interaction"
import { ICommandOptionType } from "../../types/ICommandOptionType"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

async function run (interaction: BaseCommandInteraction) : Promise<any> {
    console.log(mentions.roles(interaction))
}

const config: ICOMMAND_CONFIG = {
	// @ts-ignore
    name: __filename.split(sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(sep).pop() as string,

    options: [
        {
			// @ts-ignore
            type: ICommandOptionType.MENTIONABLE,
            name: "mention",
            description: "Mention a user or a role",
            required: true
        }
    ]
}

export { run, config }