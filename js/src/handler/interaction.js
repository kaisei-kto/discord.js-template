const { BaseCommandInteraction, Role, GuildMember } = require('discord.js');

const mentions = (
{
    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
    roles: function (interaction) {
        /**
         * @type {Role[]}
         */
        const roles = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.role) {
                roles.push(option.role)
            }
        }

        return roles
    },

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
    members: function (interaction) {
        /**
         * @type {GuildMember[]}
         */
        const members = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.member) {
                members.push(option.member)
            }
        }

        return members
    },

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
    users: function (interaction) {
        /**
         * @type {User[]}
         */
        const users = []

        for (const option of interaction.options.data) {
            if (option.type === 'MENTIONABLE' && option.user) {
                users.push(option.user)
            }
        }

        return users
    },

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
     channels: function (interaction) {
        /**
         * @type {Channel[]}
         */
        const channels = []

        for (const option of interaction.options.data) {
            if (option.type === 'CHANNEL' && option.channel) {
                channels.push(option.channel)
            }
        }

        return channels
    }
});

/**
 * 
 * @param {BaseCommandInteraction} interaction 
 */
function get_args (interaction) {
    /**
     * @type {string[]}
     */
    const args = []

    for (const option of interaction.options.data) {
        if (option.type === 'STRING' && typeof(option.value) === 'string') {
            args.push(...option.value.replace(/ +/g, ' ').split(' '))
        }
    }

    return args
}

/**
 * 
 * @param {BaseCommandInteraction} interaction 
 */
 function get_numbers (interaction) {
    /**
     * @type {number[]}
     */
    const args = []

    for (const option of interaction.options.data) {
        if ((option.type === 'INTEGER' || option.type === 'NUMBER') && typeof(option.value) === 'number') {
            args.push(option.value)
        }
    }

    return args
}

/**
 * 
 * @param {BaseCommandInteraction} interaction 
 */
 function get_booleans (interaction) {
    /**
     * @type {boolean[]}
     */
    const args = []

    for (const option of interaction.options.data) {
        if (option.type === 'BOOLEAN' && typeof(option.value) === 'boolean') {
            args.push(option.value)
        }
    }

    return args
}

module.exports = {
    mentions,
    get_args,
	get_numbers,
	get_booleans
}