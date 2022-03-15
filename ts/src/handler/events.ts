import { Client } from "discord.js";
import { Constants } from 'discord.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { handler } from "../constants";

function init (bot: Client) {
	const events_dir = join(process.cwd(), 'src', 'events')
	for (const event_name of Object.values(Constants.Events)) {
		handler.handler.addClientEvent(event_name, async (...args: any) => (existsSync(join(events_dir, event_name + '.ts')) ? (await import(join(events_dir, event_name))).default : function(){})(...Object.values(args.length === 0 ? [bot] : [...args])))
	}
}

export { init }