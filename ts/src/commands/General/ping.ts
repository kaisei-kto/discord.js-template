import { BaseCommandInteraction, Message, MessageEmbed } from "discord.js"
import { sep } from "path"
import { EMBED_COLORS } from "../../constants"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

async function run (interaction: BaseCommandInteraction) : Promise<any> {
	interaction.followUp({ embeds: [
		new MessageEmbed()
			.setDescription('🏓 Pong!')
			.setColor(EMBED_COLORS.BASE)
	] }).then(reply => {
		if (reply instanceof Message) {
			reply.edit({ embeds: [ (reply.embeds[0] as MessageEmbed).setDescription(`🏓 ${Math.floor(Number(reply.createdTimestamp) - interaction.createdTimestamp)} ms`) ] })
		}
	})
}

const config: ICOMMAND_CONFIG = {
	// @ts-ignore
    name: __filename.split(sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(sep).pop() as string,
}

export { run, config }