const { BaseCommandInteraction, MessageEmbed } = require('discord.js')
const { EMBED_COLORS } = require('../../constants')

/**
 * 
 * @param {BaseCommandInteraction} interaction
 */
async function run (interaction) {
	interaction.followUp({ embeds: [
		new MessageEmbed()
			.setDescription('🏓 Pong!')
			.setColor(EMBED_COLORS.BASE)
	] }).then(reply => {
		reply.edit({ embeds: [ reply.embeds[0].setDescription(`🏓 ${Math.floor(reply.createdTimestamp - interaction.createdTimestamp)} ms`) ] })
	})
}

/**
 * @type {import('../../types/ITypes').ICOMMAND_CONFIG}
 */
const config = {
    name: __filename.split(require('path').sep).pop().split('.').shift(),
	description: 'N/A',
	category: __dirname.split(require('path').sep).pop()
}

module.exports = { run, config }