import { BaseCommandInteraction, MessageEmbed } from "discord.js"
import { sep } from "path"
import { generate_discord_time_format, EMBED_COLORS } from "../../constants"
import { get_args, mentions } from "../../handler/interaction"
import { ICommandOptionType } from "../../types/ICommandOptionType"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

async function run (interaction: BaseCommandInteraction) : Promise<any> {
	const args = get_args(interaction)
	const member = (args.length === 1 && await interaction?.guild?.members.resolve(args[0])) || mentions.members(interaction)[0] || interaction.member

	if (!interaction.guild) return;
	if (!member) return;

	interaction.followUp({ embeds: [
		new MessageEmbed()
			.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
			.addField('Id', member.user.id, true)
			.addField('Username', member.user.username.replace(/`+/g, '\\`').replace(/\*+/g, '\\*').replace(/_+/g, '\\_').replace(/~+/g, '\\~'), true)
			.addField('Joined Discord At', `${generate_discord_time_format(0, 'F', member.user.createdTimestamp)} (${generate_discord_time_format(0, 'R', member.user.createdTimestamp)})`, false)
			.addField(`Joined Server At [User-${interaction.guild.members.cache.toJSON().sort((a:any,b:any)=>a.joinedTimestamp-b.joinedTimestamp).findIndex(m => member === m) + 1}]`, `${generate_discord_time_format(0, 'F', Number(member.joinedTimestamp))} (${generate_discord_time_format(0, 'R', Number(member.joinedTimestamp))})`)
			.setColor(EMBED_COLORS.BASE)
	] })
}

const config: ICOMMAND_CONFIG = {
	// @ts-ignore
    name: __filename.split(sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(sep).pop() as string,

	options: [
		{
			name: 'member_id',
			description: "Input a member's id",
			required: false,
			// @ts-ignore
			type: ICommandOptionType.STRING
		},
		{
			name: 'member',
			description: "Mention a member",
			required: false,
			// @ts-ignore
			type: ICommandOptionType.MENTIONABLE
		}
	]
}

export { run, config }