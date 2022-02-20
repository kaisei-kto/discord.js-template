import { BaseCommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import { CreateSlashCommandOptions } from "dkto.js"
import { sep } from "path"
import { EMBED_COLORS } from "../../constants"
import { get_args, mentions } from "../../handler/interaction"
import { ICOMMAND_CONFIG } from "../../types/ITypes"

const key = "kick"

async function run (interaction: BaseCommandInteraction): Promise<any>{
	const embed = new MessageEmbed().setColor(EMBED_COLORS.ERROR).setTimestamp()

	if (!(interaction.guild && interaction.member && interaction.guild.me)) return;

	const args = get_args(interaction)
	var member: GuildMember|undefined|null = mentions.members(interaction).shift()

	if (!member && (member = await interaction.guild.members.resolve(args[0])) && member) {
		args.shift()
	}

	if (!member) return interaction.followUp({ embeds: [embed.setDescription(`**You must input a member mention or member id to ${key}**`)] })
	if (member === interaction.member) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} yourself**`)] })
	if (member === interaction.guild.me) return interaction.followUp({ embeds: [embed.setDescription(`**I cannot ${key} myself**`)] })
	if (member.user.bot) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} bots**`)] })
	if ((interaction.member as GuildMember).roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} this member as they have a higher/the same role than/as you**`)] })
	if (interaction.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.followUp({ embeds: [embed.setDescription(`**I cannot ${key} this member as they have a higher/the same role than/as me**`)] })

	// if first string is empty then use N/A as a reason
	const reason = args.join(' ') || 'N/A'
	member.kick(reason).then(member => {
		interaction.followUp({ embeds: [embed.setColor(EMBED_COLORS.BASE)
			.setDescription(`${member.toString()} (${member.user.tag}) **has been kicked for the following reason:\n${reason}**`)] })
	})
}

const config: ICOMMAND_CONFIG = {
	name: __filename.split(sep).pop()?.split('.').shift() as string,
	description: 'N/A',
	category: __dirname.split(sep).pop() as string,
	ephemeral: false,

	options: CreateSlashCommandOptions()
		.string({
			name: 'member_id',
			description: 'Input the user\'s id',
			required: false
		})
		.mentionable({
			name: 'member',
			description: 'Mention a user',
			required: false
		})
		.string({
			name: 'reason',
			description: `${key} reason`,
			required: false
		})
	.toJSON(),

	permissions: ['KICK_MEMBERS']
}

export { run, config }