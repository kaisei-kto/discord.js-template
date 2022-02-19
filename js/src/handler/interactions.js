require('./interactions')
/**
 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
function CreateOptions(parent) {
	class InteractionOptions {
		options = []

		constructor() {}

		sub_command_group({name, description}) {
			return new SCGroup(name, description, this, this.options)
		}

		string({name, description, required, autocomplete, choices}) {
			this.options.push({ name, description, required, autocomplete, choices, type: 3 })

			return this
		}


		integer({name, description, required, autocomplete, choices, min_value, max_value}) {
			this.options.push({ name, description, required, autocomplete, choices, min_value, max_value, type: 4 })

			return this
		}

		boolean({name, description, required}) {
			this.options.push({ name, description, required, type: 5 })

			return this
		}

		user({name, description, required}) {
			this.options.push({ name, description, required, type: 6 })

			return this
		}

		channel({name, description, required, channel_types}) {
			this.options.push({ name, description, required, channel_types, type: 7 })

			return this
		}

		role({name, description, required}) {
			this.options.push({ name, description, required, type: 8 })

			return this
		}

		mentionable({name, description, required}) {
			this.options.push({ name, description, required, type: 9 })

			return this
		}

		number({name, description, required, autocomplete, choices, min_value, max_value}) {
			this.options.push({ name, description, required, autocomplete, choices, min_value, max_value, type: 10 })

			return this
		}

		attachment({name, description, required}) {
			this.options.push({ name, description, required, type: 11 })

			return this
		}

		toJSON() {
			return Object.freeze(this.options)
		}
	}

	class SC extends InteractionOptions {
		#name;
		#description;
		/**
		 * @type {SCGroup}
		 */
		#self;
		#opts;

		constructor (name, description, self, options) {
			super()

			this.#name = name
			this.#description = description
			this.#self = self
			this.#opts = options
		}

		build() {
			this.#opts.push({ name: this.#name, description: this.#description, options: this.options, type: 1 });

			return this.#self
		}
	}

	class SCGroup {
		#name;
		#description;
		/**
		 * @type {InteractionOptions}
		 */
		#self;
		#options = []
		#opts;

		constructor (name, description, self, options) {
			this.#name = name
			this.#description = description
			this.#self = self
			this.#opts = options
		}

		sub_command({ name, description }) {
			return new SC(name, description, this, this.#options)
		}

		build() {
			this.#opts.push({ name: this.#name, description: this.#description, options: this.#options, type: 2 });

			return this.#self
		}
	}

	return new InteractionOptions()
}

// console.log(
// 	JSON.stringify(
// 		CreateOptions()
// 			.sub_command_group({
// 				name: 'hi',
// 				description: 'b'
// 			})
// 			.sub_command({ name: 'hi', description: 'h' })
// 				.boolean({name: 'hi', description: 'a', required: true})
// 				.boolean({name: 'hi', description: 'a2', required: true}).build()
// 			.done()
// 		.toJSON()
// 	)
// )

module.exports = { CreateOptions }