import { BaseCommandInteraction, Role, GuildMember, User, Channel } from 'discord.js';

type f_roles = (interaction: BaseCommandInteraction) => Role[]
type f_mems = (interaction: BaseCommandInteraction) => GuildMember[]
type f_chans = (interaction: BaseCommandInteraction) => Channel[]
type f_users = (interaction: BaseCommandInteraction) => User[]
type f_args = (interaction: BaseCommandInteraction) => string[]

// @ts-ignore
const mentions: {
	roles: f_roles,
	members: f_mems,
	users: f_users,
	channels: f_chans
} = {}

{
    mentions.roles = function (interaction: BaseCommandInteraction): Role[] {
        const roles: Role[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.role instanceof Role) {
                roles.push(option.role)
            }
        }

        return roles
    }

    mentions.members = function (interaction: BaseCommandInteraction) : GuildMember[] {
        const members: GuildMember[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.member instanceof GuildMember) {
                members.push(option.member)
            }
        }

        return members
    }

    mentions.users = function (interaction: BaseCommandInteraction) : User[] {
        const users: User[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.user instanceof User) {
                users.push(option.user)
            }
        }

        return users
    }

    mentions.channels = function (interaction: BaseCommandInteraction) : Channel[] {
        const channels: Channel[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'CHANNEL' && option.channel) {
				// @ts-ignore
                option.push(option.channel)
            }
        }

        return channels
    }
};

function get_args (interaction: BaseCommandInteraction) : string[] {
    const args: string[] = []

    for (const option of interaction.options.data) {
        if (option.type === 'STRING' && option.value !== undefined) {
            args.push(...String(option.value).replace(/ +/g, ' ').split(' '))
        }
    }

    return args
}

export {
    mentions,
    get_args
}