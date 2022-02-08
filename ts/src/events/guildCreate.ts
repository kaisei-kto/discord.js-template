import { Guild } from "discord.js"
import { initialize_permissions } from "../handler/cmds"

export default function (guild: Guild) {
    initialize_permissions(guild).catch(() => void -1); // automatically sets the cmds perms upon server join
};
