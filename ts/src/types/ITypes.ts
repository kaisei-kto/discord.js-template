import { BaseCommandInteraction, PermissionString, ApplicationCommandOption } from "discord.js"

type ICOMMAND_CONFIG = {
	name: string,
	description: string,
	category: string,
	permissions: PermissionString[]|undefined,
	ephemeral: boolean,

	role_ids: string[]|undefined,
	member_ids: string[]|undefined,
	options: ApplicationCommandOption[]|undefined
}

type ICOMMAND_RUN = (interaction: BaseCommandInteraction) => any

type ICOMMAND_OBJECT = {
	config: ICOMMAND_CONFIG,
	run: ICOMMAND_RUN
}

export { ICOMMAND_CONFIG, ICOMMAND_RUN, ICOMMAND_OBJECT }