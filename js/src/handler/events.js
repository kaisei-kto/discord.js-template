const { Constants } = require('discord.js');
const { dkto } = require('dkto.js');
const { existsSync } = require('fs');
const { join } = require('path');

function init () {
	const events_dir = join(process.cwd(), 'src', 'events')
	for (const event_name of Object.values(Constants.Events)) {
		dkto.handler.events.listen(event_name, (...args) => (existsSync(join(events_dir, event_name + '.js')) ? require(join(events_dir, event_name)) : function(){})(...Object.values(args.length === 0 ? [bot] : [...args])))
	}
}

module.exports = { init }