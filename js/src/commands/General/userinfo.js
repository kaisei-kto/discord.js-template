const { BaseCommandInteraction, MessageEmbed } = require('discord.js')
const { EMBED_COLORS, generate_discord_time_format } = require('../../constants')
const ICommandOptionType = require('../../types/ICommandOptionType')
const { get_args, mentions } = require('../../handler/interaction')

/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	const args = get_args(interaction)
	const member = (args.length === 1 && await interaction.guild.members.resolve(args[0])) || mentions.members(interaction)[0] || interaction.member

	interaction.followUp({ embeds: [
		new MessageEmbed()
			.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
			.addField('Id', member.user.id, true)
			.addField('Username', member.user.username.replace(/`+/g, '\\`').replace(/\*+/g, '\\*').replace(/_+/g, '\\_').replace(/~+/g, '\\~'), true)
			.addField('Joined Discord At', `${generate_discord_time_format(0, 'F', member.user.createdTimestamp)} (${generate_discord_time_format(0, 'R', member.user.createdTimestamp)})`, false)
			.addField(`Joined Server At [User-${interaction.guild.members.cache.toJSON().sort((a,b)=>a.joinedTimestamp-b.joinedTimestamp).findIndex(m => member === m) + 1}]`, `${generate_discord_time_format(0, 'F', member.joinedTimestamp)} (${generate_discord_time_format(0, 'R', member.joinedTimestamp)})`)
			.setColor(EMBED_COLORS.BASE)
	] })
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
	description: 'N/A',
	category: __dirname.split(require('path').sep).pop(),

	options: [
		{
			name: 'member_id',
			description: "Input a member's id",
			required: false,
			type: ICommandOptionType.STRING
		},
		{
			name: 'member',
			description: "Mention a member",
			required: false,
			type: ICommandOptionType.MENTIONABLE
		}
	]
}

module.exports = { run, config }