import Discord, { Client, Collection } from "discord.js";
import fs from "fs";
import Datastore from "./client/datastore.js";
import { command, radio } from "./client/utils/typings.js";
import config from "./config.js";
import messages from "./client/messages.js";
import path from "path";

const events = "./client/events/";

const GatewayIntents = new Discord.Intents();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 7, // GUILD_VOICE_STATES
    1 << 9 // GUILD_MESSAGES
);

class RadioClient extends Client {
    readonly commands: Collection<string, command>;
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
        this.radio = new Map();
        this.datastore = null;

        this.funcs = {};
        this.funcs.check = require("./client/funcs/check.js");
        this.funcs.checkFetchStatus = require("./client/funcs/checkFetchStatus.js");
        this.funcs.isDev = require("./client/funcs/isDev.js");
        this.funcs.logger = require("./client/funcs/logger.js");
        this.funcs.msToTime = require("./client/funcs/msToTime.js");
        this.funcs.statisticsUpdate = require("./client/funcs/statisticsUpdate.js");
        this.funcs.saveState = require("./client/funcs/saveState.js");
        this.funcs.loadState = require("./client/funcs/loadState.js");
        this.funcs.searchStation = require("./client/funcs/searchStation.js");
        this.funcs.play = require("./client/funcs/play.js");
        this.funcs.listStations = require("./client/funcs/listStations.js");
        this.funcs.restoreRadios = require("./client/funcs/restoreRadios.js");
        this.funcs.saveRadios = require("./client/funcs/saveRadios.js");

        console.log('RadioX ' + this.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2021 EximiaBots by Warén Group');
        console.log('');

        this.funcs.logger("Bot", "Starting");

        const commandFiles = fs.readdirSync(path.join("./src/client/commands")).filter(f => f.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`./client/commands/${file}`);
            this.commands.set(command.name, command);
        }

        this.on("ready", () => {
            require(`${events}ready`).execute(this);
        });

        this.on("messageCreate", msg => {
            require(`${events}messageCreate`).execute(this, msg);
        });

        this.on("messageDelete", msg => {
            require(`${events}messageDelete`).execute(this, msg);
        });

        this.on("interactionCreate", interaction => {
            require(`${events}interactionCreate`).execute(this, interaction);
        });
        
        this.on("voiceStateUpdate", (oldState, newState) => {
            require(`${events}voiceStateUpdate`).execute(this, oldState, newState);
        });
        
        process.on('SIGINT', () => {
            require(`${events}SIGINT`).execute(this);
        });

        process.on('SIGTERM', () => {
            require(`${events}SIGTERM`).execute(this);
        });

        process.on('uncaughtException', (error) => {
            require(`${events}uncaughtException`).execute(this, error);
        });

        process.on('exit', () => {
            this.funcs.logger("Bot", "Stopping");
        });
        
        this.on("error", error => {
            console.error(error);
        });

        this.login(this.config.token).catch(err => console.log("Failed to login: " + err));
    }
}

export default RadioClient