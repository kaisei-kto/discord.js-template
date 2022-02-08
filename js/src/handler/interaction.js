const { BaseCommandInteraction, Role, GuildMember } = require('discord.js');

const mentions = {}

{
    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
    mentions.roles = function (interaction) {
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
    }

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
     mentions.members = function (interaction) {
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
    }

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
     mentions.users = function (interaction) {
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
    }

    /**
     * 
     * @param {BaseCommandInteraction} interaction 
     */
     mentions.channels = function (interaction) {
        /**
         * @type {Channel[]}
         */
        const channels = []

        for (const option of interaction.options.data) {
            if (option.type === 'CHANNEL' && option.channel) {
                option.push(option.channel)
            }
        }

        return channels
    }
};

/**
 * 
 * @param {BaseCommandInteraction} interaction 
 */
function get_args (interaction) {
    /**
     * @type {String[]}
     */
    const args = []

    for (const option of interaction.options.data) {
        if (option.type === 'STRING') {
            args.push(...option.value.replace(/ +/g, ' ').split(' '))
        }
    }

    return args
}

module.exports = {
    mentions,
    get_args
}