const { Client, Handlers } = require("dkto.js");
const { token } = require("./config.json");
const constants = require("./src/constants");
const cmd_handler = require("./src/handler/cmds");
const events_handler = require("./src/handler/events");

const client = new Client({
	intents: 32767,
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
	ws: { properties: { $browser: "Discord iOS" } },
});

constants.handler = new Handlers(client, true);

async function start_process() {
	console.log("[MAIN] Initializing events handler...");
	events_handler.init(client);

	console.log("[MAIN] Starting the bot...");
	await client.login(token);

	console.log("[MAIN] Initializing commands handler...");
	await cmd_handler.start_initialization(client, token);
}

start_process();
