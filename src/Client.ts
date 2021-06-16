import Discord, { Client, Collection } from "discord.js";
import fs from "fs";
const events = "./client/events/";
import Datastore from "./client/datastore.js";
import { command, radio } from "./client/utils/typings.js";
import config from "./config.js";
import messages from "./client/messages.js";
import path from "path"

const GatewayIntents = new Discord.Intents();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 7, // GUILD_VOICE_STATES
    1 << 9 // GUILD_MESSAGES
);

class RadioClient extends Client {
    readonly commands: Collection<string, command>;
    readonly commandAliases: Collection<string, command>;
    readonly radio: Map<string, radio>;
    public funcs: any;
    readonly config = config;
    readonly messages = messages;
    public datastore: Datastore | null;
    constructor() {
        super({
            intents: GatewayIntents
        });
        this.commands = new Collection();
        this.commandAliases = new Collection();
        this.radio = new Map();
        this.datastore = null;

        this.funcs = {};
        this.funcs.check = require("./client/funcs/check.js");
        this.funcs.checkFetchStatus = require("./client/funcs/checkFetchStatus.js");
        this.funcs.isDev = require("./client/funcs/isDev.js");
        this.funcs.msToTime = require("./client/funcs/msToTime.js");
        this.funcs.statisticsUpdate = require("./client/funcs/statisticsUpdate.js");

        const commandFiles = fs.readdirSync(path.join("./src/client/commands")).filter(f => f.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`./client/commands/${file}`);
            command.uses = 0;
            this.commands.set(command.name, command);
            this.commandAliases.set(command.alias, command);
        }

        this.on("ready", () => {
            require(`${events}ready`).execute(this, Discord);
            this.datastore = new Datastore();
        });
        this.on("message", msg => {
            require(`${events}msg`).execute(this, msg, Discord);
        });
        this.on("voiceStateUpdate", (oldState, newState) => {
            require(`${events}voiceStateUpdate`).execute(this, oldState, newState);
        });
        this.on("error", error => {
            console.error(error);
        });

        this.login(this.config.token).catch(err => console.log("Failed to login: " + err));
    }
}

export default RadioClient