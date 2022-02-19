const { BaseCommandInteraction, MessageEmbed, TextChannel, PermissionOverwrites } = require('discord.js')
const { EMBED_COLORS } = require('../../constants')
const { CreateOptions } = require('../../handler/interactions')

/**
 * 
 * @param {TextChannel} channel 
 */
function getPermissions(id, channel, type) {
	/**
	 * @type {Map<string, PermissionOverwrites>}
	 */
	const permissions_map = new Map()

	for (const permission of channel.permissionOverwrites.cache.toJSON()) {
		permissions_map.set(permission.id, {
			id: permission.id,
			type: permission.type,
			allow: permission.allow.toArray(),
			deny: permission.deny.toArray()
		})
	}

	const perm = {
		id,
		type: 'role',
		allow: [],
		deny: []
	}

	if (permissions_map.has(id)) {
		perm.allow = permissions_map.get(id).allow
		perm.deny = permissions_map.get(id).deny
	}

	if (type === 'lock' && perm.deny.indexOf('SEND_MESSAGES') === -1) {
		perm.deny.push('SEND_MESSAGES')
	}

	if (type === 'unlock') {
		perm.deny = permissions_map.get(id).deny.filter(v => v !== 'SEND_MESSAGES')
	}

	permissions_map.set(perm.id, perm)

	return permissions_map
}

/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	if (!(interaction.channel.isText() && interaction.channel instanceof TextChannel)) return;
	const type = String(interaction.options._group)
	const option = String(interaction.options._subcommand)

	if (option === 'all') {
		for (const channel of interaction.guild.channels.cache.toJSON().filter(channel => channel.isText()))
			await channel.permissionOverwrites.set(
				Array.from(
					getPermissions(interaction.guildId, channel, type === 'unlock' ? 'unlock' : 'lock').values()
				)
			).catch(() => {})

		return interaction.followUp({
			embeds: [
				new MessageEmbed()
					.setColor(EMBED_COLORS.BASE)
					.setDescription(`All text channels has been ${type}ed`)
			]
		})
	}

	if (option === 'category') {
		const category = interaction.channel.isText() && interaction.channel.parent
		for (const channel of interaction.guild.channels.cache.toJSON().filter(channel => channel.isText() && channel.parent === category))
			channel.permissionOverwrites.set(
				Array.from(
					getPermissions(interaction.guildId, channel, type === 'unlock' ? 'unlock' : 'lock').values()
				)
			).catch(() => {})

		return interaction.followUp({
			embeds: [
				new MessageEmbed()
					.setColor(EMBED_COLORS.BASE)
					.setDescription(`All text channels under this category has been ${type}ed`)
			]
		})
	}

	if (option === 'single') {
		await interaction.channel.permissionOverwrites.set(
			Array.from(
				getPermissions(interaction.guildId, interaction.channel, type === 'unlock' ? 'unlock' : 'lock').values()
			)
		).catch(() => {})

		return interaction.followUp({
			embeds: [
				new MessageEmbed()
					.setColor(EMBED_COLORS.BASE)
					.setDescription(`This channel has been ${type}ed`)
			]
		})
	}
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
	description: 'N/A',
	category: __dirname.split(require('path').sep).pop(),
	ephemeral: true,

	options: (
		CreateOptions()
			.sub_command_group({ name: 'lock', description: 'N/A' })
				.sub_command({ name: 'all', description: 'Locks all of the existing channels' }).build()
				.sub_command({ name: 'category', description: 'Locks the existing channels that falls under the same category that this command is executed in' }).build()
				.sub_command({ name: 'single', description: 'Locks the current channel that this command is executed in' }).build()
				.build()
				
				.sub_command_group({ name: 'unlock', description: 'N/A'})
				.sub_command({ name: 'all', description: 'Unlocks all of the existing channels' }).build()
				.sub_command({ name: 'category', description: 'Unlocks the existing channels that falls under the same category that this command is executed in' }).build()
				.sub_command({ name: 'single', description: 'Unlocks the current channel that this command is executed in' }).build()
			.build()
		.toJSON()
	),

	permissions: ['MANAGE_CHANNELS', 'VIEW_AUDIT_LOG']
}

module.exports = { run, config }