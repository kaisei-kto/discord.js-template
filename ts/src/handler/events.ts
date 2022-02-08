import { Client } from "discord.js";
import { Constants } from 'discord.js';
import { existsSync } from 'fs';
import { join } from 'path';

function init (bot: Client) {
    const events_dir = join(process.cwd(), 'src', 'events')
    for (const event_name of Object.values(Constants.Events)) {
		// @ts-ignore
        bot.on(event_name, async (...args) => (existsSync(join(events_dir, event_name + '.ts')) ? (await import(join(events_dir, event_name))).default : function(){})(...Object.values(args.length === 0 ? [bot] : [...args])))
    }
}

export { init }