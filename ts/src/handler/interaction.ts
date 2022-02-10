import { BaseCommandInteraction, Role, GuildMember, User, Channel } from 'discord.js';

const mentions = {
    roles: function (interaction: BaseCommandInteraction): Role[] {
        const roles: Role[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.role instanceof Role) {
                roles.push(option.role)
            }
        }

        return roles
    },

    members: function (interaction: BaseCommandInteraction) : GuildMember[] {
        const members: GuildMember[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.member instanceof GuildMember) {
                members.push(option.member)
            }
        }

        return members
    },

    users: function (interaction: BaseCommandInteraction) : User[] {
        const users: User[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.user instanceof User) {
                users.push(option.user)
            }
        }

        return users
    },

    channels: function (interaction: BaseCommandInteraction) : Channel[] {
        const channels: Channel[] = []

        for (const option of interaction.options.data) {
            if (option.type === 'CHANNEL' && option.channel) {
				// @ts-ignore
                channels.push(option.channel)
            }
        }

        return channels
    }
}

function get_args (interaction: BaseCommandInteraction) : string[] {
    const args: string[] = []

    for (const option of interaction.options.data) {
        if (option.type === 'STRING' && typeof(option.value) === 'string') {
            args.push(...option.value.replace(/ +/g, ' ').split(' '))
        }
    }

    return args
}

function get_numbers (interaction: BaseCommandInteraction) : number[] {
    const args: number[] = []

    for (const option of interaction.options.data) {
        if ((option.type === 'INTEGER' || option.type === 'NUMBER') && typeof(option.value) === 'number') {
            args.push(option.value as number)
        }
    }

    return args
}

function get_booleans (interaction: BaseCommandInteraction) : boolean[] {
	const args: boolean[] = []

	for (const option of interaction.options.data) {
		if (option.type === 'BOOLEAN' && typeof(option.value) === 'boolean') {
			args.push(option.value)
		}
	}

	return args
}

export {
    mentions,
    get_args,
	get_numbers,
	get_booleans
}