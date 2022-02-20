import { BaseCommandInteraction, MessageEmbed } from "discord.js"
import { sep } from "path"
import { EMBED_COLORS } from "../../constants"
import { get_commands } from "../../handler/cmds"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

async function run (interaction: BaseCommandInteraction) : Promise<any> {
	const commands: { [key: string]: any } = {}
	for (const command of get_commands()) commands[command.config.category] = [...(command.config.category in commands ? commands[command.config.category] : []), command.config.name]

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
					value: commands[name].sort((a: any, b: any)=>a.localeCompare(b)).join(', '),
					inline: false
				}
			}))
	] })
}

const config: ICOMMAND_CONFIG = {
	name: __filename.split(sep).pop()?.split('.').shift() as string,
	description: 'N/A',
	category: __dirname.split(sep).pop() as string,
	ephemeral: true
}

export { run, config }