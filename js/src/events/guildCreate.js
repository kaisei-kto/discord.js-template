const { Guild } = require("discord.js");
const { initialize_permissions } = require("../handler/cmds");

/**
 *
 * @param {Guild} guild
 */
module.exports = function (guild) {
    initialize_permissions(guild).catch(() => void -1); // automatically sets the cmds perms upon server join
};
