const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { readdirSync } = require('fs');
const { join } = require('path');
const { Client, BaseCommandInteraction, ApplicationCommand, Guild } = require('discord.js');
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

    if (!is_initialized) {
        is_initialized = true
        console.log('[COMMANDS HANDLER] Initialization has been completed')
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
    reload_command,
    get initialized() {
        return is_initialized
    }
}