const { BaseCommandInteraction, PermissionString } = require("discord.js");

/**
 * @typedef {object} ICOMMAND_CONFIG
 * @property {String} ICOMMAND_CONFIG.name
 * @property {String} ICOMMAND_CONFIG.description
 * @property {String} ICOMMAND_CONFIG.category
 * @property {String[]} ICOMMAND_CONFIG.role_ids
 * @property {String[]} ICOMMAND_CONFIG.member_ids
 * @property {PermissionString[]|undefined} ICOMMAND_CONFIG.permissions
 * @property {Boolean|undefined} ICOMMAND_CONFIG.ephemeral
 * @property {import('discord.js').ApplicationCommandOption[]} options
 */

/**
 * @typedef {Function} ICOMMAND_RUN
 * @param {BaseCommandInteraction} interaction
 * 
 * @returns {unknown}
 */

/**
 * @typedef {object} ICOMMAND_OBJECT
 * @property {ICOMMAND_RUN} run
 * @property {ICOMMAND_CONFIG} config
 */