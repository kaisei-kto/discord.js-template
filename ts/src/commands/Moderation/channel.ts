import { ICOMMAND_CONFIG } from "../../types/ITypes"
import { BaseCommandInteraction, MessageEmbed, TextChannel, PermissionOverwrites, PermissionString } from 'discord.js'
import { EMBED_COLORS } from '../../constants'
import { CreateSlashCommandOptions } from "dkto.js"

function getPermissions(id: string, channel: TextChannel, type: 'lock'|'unlock') {
	const permissions_map = new Map<string, any>()

	// @ts-ignore
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
		allow: [] as PermissionString[],
		deny: [] as PermissionString[]
	}

	if (permissions_map.has(id)) {
		perm.allow = permissions_map.get(id).allow
		perm.deny = permissions_map.get(id).deny
	}

	if (type === 'lock' && perm.deny.indexOf('SEND_MESSAGES') === -1) {
		perm.deny.push('SEND_MESSAGES')
	}

	if (type === 'unlock') {
		// @ts-ignore
		perm.deny = permissions_map.get(id).deny.filter(v => v !== 'SEND_MESSAGES')
	}

	permissions_map.set(perm.id, perm)

	return permissions_map
}

async function run (interaction: BaseCommandInteraction) {
	if (!(interaction.channel instanceof TextChannel && interaction.guild && interaction.guildId)) return;

	// @ts-ignore
	const type = String(interaction.options._group)
	// @ts-ignore
	const option = String(interaction.options._subcommand)

	if (option === 'all') {
		for (const channel of interaction.guild.channels.cache.toJSON().filter(channel => channel.type === 'GUILD_TEXT'))
			await (channel as TextChannel).permissionOverwrites.set(
				Array.from(
					getPermissions(interaction.guildId, channel as TextChannel, type === 'unlock' ? 'unlock' : 'lock').values()
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
		for (const channel of interaction.guild.channels.cache.toJSON().filter(channel => channel.type === 'GUILD_TEXT' && channel.parent === category))
			await (channel as TextChannel).permissionOverwrites.set(
				Array.from(
					getPermissions(interaction.guildId, channel as TextChannel, type === 'unlock' ? 'unlock' : 'lock').values()
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
		interaction.channel.permissionOverwrites.set(
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

const config: ICOMMAND_CONFIG = {
    name: String(String(__filename.split(require('path').sep).pop()).split('.').shift()),
	description: 'N/A',
	category: String(__dirname.split(require('path').sep).pop()),
	ephemeral: true,

	options: (
		CreateSlashCommandOptions()
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