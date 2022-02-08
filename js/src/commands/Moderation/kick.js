const { BaseCommandInteraction, MessageEmbed } = require('discord.js')
const { EMBED_COLORS, MESSAGES } = require('../../constants')
const { reload_command } = require('../../handler/cmds')
const { get_args, mentions } = require('../../handler/interaction')
const key = "kick"

/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	const embed = new MessageEmbed().setColor(EMBED_COLORS.ERROR).setTimestamp()

	const args = get_args(interaction)
	var member = mentions.members(interaction).shift()

	if (!member && (member = await interaction.guild.members.resolve(args[0])) && member) {
		args.shift()
	}

	if (!member) return interaction.followUp({ embeds: [embed.setDescription(`**You must input a member mention or member id to ${key}**`)] })
	if (member === interaction.member) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} yourself**`)] })
	if (member === interaction.guild.me) return interaction.followUp({ embeds: [embed.setDescription(`**I cannot ${key} myself**`)] })
	if (member.user.bot) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} bots**`)] })
	if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.followUp({ embeds: [embed.setDescription(`**You cannot ${key} this member as they have a higher/the same role than/as you**`)] })
	if (interaction.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.followUp({ embeds: [embed.setDescription(`**I cannot ${key} this member as they have a higher/the same role than/as me**`)] })

	// if first string is empty then use N/A as a reason
	const reason = args.join(' ') || 'N/A'
	member.kick(reason).then(member => {
		interaction.followUp({ embeds: [embed.setColor(EMBED_COLORS.BASE)
			.setDescription(`${member.toString()} (${member.user.tag}) **has been kicked for the following reason:\n${reason}**`)] })
	})
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
    description: 'N/A',
    category: __dirname.split(require('path').sep).pop(),
    ephemeral: false,

    options: [
        {
            type: require('../../types/ICommandOptionType').STRING, //always 1st arg since this is the first option, and so forth
            name: "member_id",
            description: "Input the user's id",
            required: false
        },
		{
			type: require('../../types/ICommandOptionType').MENTIONABLE,
			name: "member",
			description: "Mention a user",
			required: false
		},
		{
			type: require('../../types/ICommandOptionType').STRING,
			name: "reason",
			description: "Kick reason",
			required: false
		}
    ],

	permissions: ['KICK_MEMBERS']
}

module.exports = { run, config }