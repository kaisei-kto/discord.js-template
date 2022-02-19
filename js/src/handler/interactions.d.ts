// @ts-nocheck

import { ApplicationCommandOption, ApplicationCommandOptionChoice, ChannelType } from "discord.js";

export function CreateOptions(parent: any) {
	interface base_setup {
		name: string,
		description: string,
		required?: boolean
	}

	interface number_type extends base_setup {
		min_value?: number,
		max_value?: number,
		choices?: ApplicationCommandOptionChoice[]
	}

	interface string_type extends base_setup {
		autocomplete?: boolean,
		choices?: ApplicationCommandOptionChoice[]
	}

	interface channel_type extends base_setup {
		channel_types: ChannelType[]
	}

	class SC extends InteractionOptions {
		private self : InteractionOptions
		private options : ApplicationCommandOption[]

		build() : SCGroup
	}
	
	class SCGroup {
		private self : InteractionOptions
		private options : ApplicationCommandOption[]

		sub_command(object: base_setup) : SC

		build() : InteractionOptions
	}

	class InteractionOptions {
		private options: ApplicationCommandOption[]
	
		constructor() : this

		// sub_command() : void // 1

		sub_command_group(object: base_setup) : SCGroup // 2
	
		string(object: string_type) : this // 3

		integer(object: number_type) : this // 4

		boolean(object: base_setup) : this // 5

		user(object: base_setup) : this // 6

		channel(object: channel_type) : this // 7

		role(object: base_setup) : this // 8

		mentionable(object: base_setup) : void // 9

		number(object: number_type) : this // 10

		attachment(object: base_setup) : this // 11

		toJSON() : ApplicationCommandOption[]
	}

	return new InteractionOptions()
}