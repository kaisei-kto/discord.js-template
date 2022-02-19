import { BaseCommandInteraction, PermissionString, ApplicationCommandOption } from "discord.js"

type ICOMMAND_CONFIG = {
	name: string,
	description: string,
	category: string,
	permissions?: PermissionString[],
	ephemeral?: boolean,

	role_ids?: string[],
	member_ids?: string[],
	options?: ApplicationCommandOption[]
}

type ICOMMAND_RUN = (interaction: BaseCommandInteraction) => any

type ICOMMAND_OBJECT = {
	config: ICOMMAND_CONFIG,
	run: ICOMMAND_RUN
}

export { ICOMMAND_CONFIG, ICOMMAND_RUN, ICOMMAND_OBJECT }