const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { readdirSync } = require('fs');
const { join } = require('path');
const { Client, BaseCommandInteraction, ApplicationCommand, Guild, MessageSelectMenu } = require('discord.js');
const { DEVELOPER_IDS } = require('../constants');

let is_initialized = false

/**
 * @type {Map<String, import('../types/ITypes').ICOMMAND_CONFIG>}
 */
const commands = new Map()

/**
 * @type {REST}
 */
var rest = undefined;

/**
 * @param {ApplicationCommand} command 
 */
function create_guild_permissions_object (command, guildId = undefined) {
    const cmd = get_command(command.name)

    const permissions = []

    if (!cmd) return []

    if (Array.isArray(cmd.config.role_ids)) {
        if (guildId) permissions.push({ id: guildId, type: 'ROLE', permission: false })
        permissions.push(...(Array(...cmd.config.role_ids).map(id => ({ id, type: 'ROLE', permission: true }))))
    }

    if (Array.isArray(cmd.config.member_ids)) {
        if (guildId && !(permissions[0] && permissions[0].id === guildId)) permissions.push({ id: guildId, type: 'ROLE', permission: false })
        permissions.push(...(Array(...cmd.config.member_ids).map(id => ({ id, type: 'USER', permission: true }))))
    }

    return permissions
}

/**
 * 
 * @param {Guild} guild 
 */
async function initialize_permissions(guild) {
    const bot_commands = await guild.client.application.commands.fetch()

    for (const command of bot_commands.toJSON()) {
        const cmd = get_command(command.name)

        if (cmd.config.category === 'Developer') {
            await command.permissions.set({ guild: guild.id, command: command.id, permissions: [{ id: guild.id, type: 'ROLE', permission: false }, ...DEVELOPER_IDS.map(id => ({ id, type: 'USER', permission: true }))] })
            continue;
        }

        let permissions;

        if ((permissions = create_guild_permissions_object(command, guild.id)) && permissions.length !== 0) {
            await command.permissions.set({ guild: guild.id, command: command.id, permissions })
        }
    }

    is_initialized = true
}

/**
 * 
 * @param {Client} bot 
 * @param {String} token 
 */
async function start_initialization(bot, token) {
    if (!is_initialized) console.log('[COMMANDS HANDLER] Initialization has been started')

    if (!is_initialized) rest = new REST({ version: '9' }).setToken(token)
    const cmds_dir = join(process.cwd(), 'src', 'commands')

    const REST_COMMANDS = []

    for (const dir of readdirSync(cmds_dir)) {
        const category_dir = join(cmds_dir, dir)

        for (const cmd_file of readdirSync(category_dir)) {
            const command = require(join(category_dir, cmd_file))
            commands.set(cmd_file.split('.').shift(), command)

            REST_COMMANDS.push(command.config)
        }
    }

    // you could just do rest.put(routes.applicationcommands(bot.application.id)) 
    await rest.put(Routes.applicationCommands(bot.application.id), { body: REST_COMMANDS })
        
    for (const guild of bot.guilds.cache.toJSON()) {
        initialize_permissions(guild)
    }

    if (!is_initialized) {
        let interval;
        interval = setInterval(() => {
            if (is_initialized) {
                console.log('[COMMANDS HANDLER] Initialization has been completed')
                clearInterval(interval)
            }
        }, 500)
    }
}

/**
 * 
 * @param {String} name 
 * @returns {import('../types/ITypes').ICOMMAND_OBJECT}
 */
function get_command(name) {
    return commands.get(name)
}

function get_commands() {
    return Array.from(commands.values())
}

/**
 * 
 * @param {String} name
 * @returns {Boolean}
 */
function reload_command(bot, name) {
    const cmd = get_command(name)

    if (!cmd) return false

    const require_path = join(process.cwd(), 'src', 'commands', cmd.config.category, cmd.config.name)
    const cmd_path = require_path + '.js'

    delete require.cache[cmd_path]

    start_initialization(bot, undefined)
}

/**
 * 
 * @param {BaseCommandInteraction} interaction 
 */
const has_permissions = (interaction) => (interaction.member.permissions.has(get_command(interaction.commandName).config.permissions))

module.exports = {
    start_initialization,
    get_command,
    get_commands,
    has_permissions,
    initialize_permissions,
    reload_command,
    get initialized() {
        return is_initialized
    }
}