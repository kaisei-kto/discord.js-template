module.exports = {
    get SUB_COMMAND() { return 1 },
    get SUB_COMMAND_GROUP() { return 2 },
    get STRING() { return 3 },
    /** Any integer between -2^53 and 2^53 */
    get INTEGER() { return 4 },
    get BOOLEAN() { return 5 },
    get USER() { return 6 },
    /** Includes all channel types + categories */
    get CHANNEL() { return 7 },
    get ROLE() { return 8 },
    /** Includes users and roles */
    get MENTIONABLE() { return 9 },
    /** Any double between -2^53 and 2^53 */
    get NUMBER() { return 10 },
}