import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Client, BaseCommandInteraction, ApplicationCommand, Guild, MessageSelectMenu, GuildResolvable, ApplicationCommandManager, GuildMember, PermissionString } from 'discord.js'
import { DEVELOPER_IDS } from '../constants'
import { ICOMMAND_OBJECT } from '../types/ITypes'

const commands = new Map<string, ICOMMAND_OBJECT>()
var rest: REST
var initialized = false

function create_guild_permissions_object (command: ApplicationCommand, guildId:string|undefined = undefined) {
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

async function initialize_permissions(guild: Guild) {
    const bot_commands: any = await guild.client.application?.commands.fetch()

    for (const command of bot_commands.toJSON()) {
        const cmd = get_command(command.name)

		if (!cmd) continue;

        if (cmd.config.category === 'Developer') {
            await command.permissions.set({ guild: guild.id, command: command.id, permissions: [{ id: guild.id, type: 'ROLE', permission: false }, ...DEVELOPER_IDS.map(id => ({ id, type: 'USER', permission: true }))] })
            continue;
        }

        let permissions;

        if ((permissions = create_guild_permissions_object(command, String(guild.id))) && permissions.length !== 0) {
            await command.permissions.set({ guild: guild.id, command: command.id, permissions })
        }
    }

    initialized = true
}

async function start_initialization(bot: Client, token: string|undefined = undefined) {
    if (!initialized) console.log('[COMMANDS HANDLER] Initialization has been started')

    if (!initialized && token) rest = new REST({ version: '9' }).setToken(token)
    const cmds_dir = join(process.cwd(), 'src', 'commands')

    const REST_COMMANDS = []

    for (const dir of readdirSync(cmds_dir)) {
        const category_dir = join(cmds_dir, dir)

        for (const cmd_file of readdirSync(category_dir)) {
            const command = await import(join(category_dir, cmd_file))
            commands.set(String(cmd_file.split('.').shift()), command)
			
            REST_COMMANDS.push(command.config)
        }
    }

    await rest.put(Routes.applicationCommands(String(bot.application?.id)), { body: REST_COMMANDS })
        
    for (const guild of bot.guilds.cache.toJSON()) {
        initialize_permissions(guild)
    }

    if (!initialized) {
        let interval: any;
        interval = setInterval(() => {
            if (initialized) {
                console.log('[COMMANDS HANDLER] Initialization has been completed')
                clearInterval(interval)
            }
        }, 500)
    }
}

function get_command(name: string) : ICOMMAND_OBJECT|undefined {
    return commands.get(name)
}

function get_commands() : ICOMMAND_OBJECT[] {
    return Array.from(commands.values())
}

function reload_command(bot: Client, name: string|undefined) : boolean {
    const cmd = get_command(String(name))

    if (!cmd) return false

    const require_path = join(process.cwd(), 'src', 'commands', cmd.config.category, cmd.config.name)
    const cmd_path = require_path + '.ts'

    delete require.cache[cmd_path]

    start_initialization(bot)

	return true
}

const has_permissions = (interaction: BaseCommandInteraction) => interaction.member && ((interaction.member as GuildMember).permissions.has(get_command(interaction.commandName)?.config.permissions as PermissionString[])) || false

export {
    start_initialization,
    get_command,
    get_commands,
    has_permissions,
    initialize_permissions,
    reload_command,
    initialized
}