import { ApplicationCommandOptionChoice, ApplicationCommandOptionData } from "discord.js"
import { ChannelTypes } from "discord.js/typings/enums"

/**
 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
function CreateOptions(parent?: any) {
	interface base_setup {
		name: string,
		description: string,
		required?: boolean
	}

	interface number_type extends base_setup {
		min_value?: number,
		max_value?: number,
		choices?: ApplicationCommandOptionChoice[],
		autocomplete?: boolean
	}

	interface string_type extends base_setup {
		autocomplete?: boolean,
		choices?: ApplicationCommandOptionChoice[]
	}

	interface channel_type extends base_setup {
		channel_types?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[]
	}
	
	class InteractionOptions {
		options: ApplicationCommandOptionData[] = []

		constructor() {}

		sub_command_group({name, description}: base_setup) : SCGroup {
			return new SCGroup(name, description, this, this.options)
		}

		string({name, description, required, autocomplete, choices}: string_type) : this {
			this.options.push({ name, description, required, autocomplete, choices, type: 3 })

			return this
		}


		integer({name, description, required, autocomplete, choices, min_value, max_value}: number_type) : this {
			this.options.push({ name, description, required, autocomplete, choices, min_value, max_value, type: 4 })

			return this
		}

		boolean({name, description, required}: base_setup) : this {
			this.options.push({ name, description, required, type: 5 })

			return this
		}

		user({name, description, required}: base_setup) : this {
			this.options.push({ name, description, required, type: 6 })

			return this
		}

		channel({name, description, required, channel_types}: channel_type) : this {
			this.options.push({ name, description, required, channel_types, type: 7 })

			return this
		}

		role({name, description, required}: base_setup) : this {
			this.options.push({ name, description, required, type: 8 })

			return this
		}

		mentionable({name, description, required}: base_setup) : this {
			this.options.push({ name, description, required, type: 9 })

			return this
		}

		number({name, description, required, autocomplete, choices, min_value, max_value} : number_type) {
			this.options.push({ name, description, required, autocomplete, choices, min_value, max_value, type: 10 })

			return this
		}

		attachment({name, description, required} : base_setup) {
			this.options.push({ name, description, required, type: 11 })

			return this
		}

		toJSON() : any {
			return Object.freeze(this.options)
		}
	}

	class SC extends InteractionOptions {
		private name: string;
		private description: string;
		private self: SCGroup;
		private opts: any;

		constructor (name: string, description: string, self: SCGroup, options: any) {
			super()

			this.name = name
			this.description = description
			this.self = self
			this.opts = options
		}

		build() : SCGroup {
			this.opts.push({ name: this.name, description: this.description, options: this.options, type: 1 });

			return this.self
		}
	}

	class SCGroup {
		private name: string;
		private description: string;
		private self: InteractionOptions;
		private options: any = []
		private opts: any;

		constructor (name: string, description: string, self: InteractionOptions, options: any) {
			this.name = name
			this.description = description
			this.self = self
			this.opts = options
		}

		sub_command({ name, description } : base_setup) {
			return new SC(name, description, this, this.options)
		}

		build() : InteractionOptions {
			this.opts.push({ name: this.name, description: this.description, options: this.options, type: 2 });

			return this.self
		}
	}

	return new InteractionOptions()
}

/*
console.log(
	JSON.stringify(
		CreateOptions()
			.sub_command_group({
				name: 'hi',
				description: 'b'
			})
			.sub_command({ name: 'hi', description: 'h' })
				.boolean({name: 'hi', description: 'a', required: true})
				.boolean({name: 'hi', description: 'a2', required: true}).build()
			.done()
		.toJSON()
	)
)
*/

export { CreateOptions }