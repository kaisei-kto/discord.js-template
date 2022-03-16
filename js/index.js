const { Client, dkto } = require("dkto.js");
const { token } = require("./config.json");
const cmd_handler = require("./src/handler/cmds");
const events_handler = require("./src/handler/events");

const client = new Client({
	intents: 32767,
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
	ws: { properties: { $browser: "Discord iOS" } },
});

dkto.handler.events.setOptions({
	client,
	hotReload: true
});

async function start_process() {
	console.log("[MAIN] Initializing events handler...");
	events_handler.init(client);

	console.log("[MAIN] Starting the bot...");
	await client.login(token);

	console.log("[MAIN] Initializing commands handler...");
	await cmd_handler.start_initialization(client, token);
}

start_process();
