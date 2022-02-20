import { ColorResolvable } from "discord.js"
import { Handlers } from "dkto.js"

var HANDLER: Handlers;
const DEVELOPER_IDS: string[] = ['user_id']

const EMBED_COLORS: { [key: string]: ColorResolvable } = {
	BASE: `#${(1311538).toString(16)}` as ColorResolvable,
	ERROR: '#FF0000' as ColorResolvable
}

const MESSAGES = {
	ERROR: "An error has occurred",
	PERMISSION_DENIED: "You do not have the permissions"
}

/**
 * 
 * @param {Number} seconds the amount of seconds to add up to current timestamp
 * @param {'t'|'T'|'d'|'D'|'F'|'R'} format ```
		`t`: Short Time (e.g 9:41 PM)
		`T`: Long Time (e.g 9:41:30 PM)
		`d`: Short Date (e.g 01/01/2000)
		`D`: Long Date (e.g 01 January 2000)
		`f` (default): Short Date/Time (e.g 01 January 2000 9:41 PM)
		`F`: Long Date/Time (e.g Saturday, January, 01, 2000 9:41 PM)
		`R`: Relative Time (e.g 22 years ago)
	```
 * @param {Number} now Date.now() by default
 */
function generate_discord_time_format(seconds = 0, format:('t'|'T'|'d'|'D'|'f'|'F'|'R') = 'f', now = Date.now()) : string {
	return `<t:${Math.floor(now/1000) + seconds}:${format}>`
}

const handler = new (class{
	set handler(o) {
		if (!HANDLER) HANDLER = o
	}

	get handler() : Handlers {
		return HANDLER
	}
})()

export {
	EMBED_COLORS,
	DEVELOPER_IDS,
	MESSAGES,

	generate_discord_time_format,

	handler
}