import { Client } from "discord.js";
import { token } from "./config.json";
import * as events_handler from "./src/handler/events";
import { start_initialization } from "./src/handler/cmds";
import { dkto } from "dkto.js";

const client = new Client({
	intents: 32767,
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
	ws: { properties: { $browser: "Discord iOS" } },
});

dkto.handler.events.setOptions({
	client,
	hotReload: true
})

async function start_process() {
	console.log("[MAIN] Initializing events handler...");
	events_handler.init(client);

	console.log("[MAIN] Starting the bot...");
	await client.login(token);

	console.log("[MAIN] Initializing commands handler...");
	await start_initialization(client, token);
}

start_process();