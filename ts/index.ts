import { Client } from "discord.js";
import * as Constants from "./src/constants"
import { token } from "./config.json";
import * as events_handler from "./src/handler/events";
import { start_initialization } from "./src/handler/cmds";

const client = new Client({
    intents: 32767,
    allowedMentions: { parse: ["users", "roles"], repliedUser: false },
    ws: { properties: { $browser: "Discord iOS" } },
});

async function start_process() {
    console.log("[MAIN] Initializing events handler...");
    events_handler.init(client);

    console.log("[MAIN] Starting the bot...");
    await client.login(token);

    console.log("[MAIN] Initializing commands handler...");
    await start_initialization(client, token);
}

start_process();