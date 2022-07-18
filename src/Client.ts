import Discord, { Client, Collection } from "discord.js";
import Datastore from "./client/classes/Datastore.js";
import Radio from "./client/classes/Radio.js";
import Stations from "./client/classes/Stations.js";
import Streamer from "./client/classes/Streamer.js";
import Statistics from "./client/classes/Statistics.js";
import fs from "fs";
import { command, radio } from "./client/utils/typings.js";
import config from "./config.js";
import messages from "./client/messages.js";
import path from "path";

const events = "./client/events/";

const GatewayIntents = new Discord.IntentsBitField();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 7, // GUILD_VOICE_STATES
    1 << 9 // GUILD_MESSAGES
);

class RadioClient extends Client {
    readonly commands: Collection<string, command>;
    public funcs: any;
    readonly config = config;
    readonly messages = messages;
    public datastore: Datastore | null;
    public stations: Stations | null;
    public streamer: Streamer | null;
    public statistics: Statistics | null;
    public radio: Radio | null;
    constructor() {
        super({
            intents: GatewayIntents
        });
        this.commands = new Collection();
        this.datastore = null;
        this.stations = null;
        this.streamer = null;
        this.statistics = null;
        this.radio = null;

        this.funcs = {};
        this.funcs.check = require("./client/funcs/check.js");
        this.funcs.isDev = require("./client/funcs/isDev.js");
        this.funcs.logger = require("./client/funcs/logger.js");
        this.funcs.msToTime = require("./client/funcs/msToTime.js");
        this.funcs.saveState = require("./client/funcs/saveState.js");
        this.funcs.loadState = require("./client/funcs/loadState.js");
        this.funcs.play = require("./client/funcs/play.js");
        this.funcs.listStations = require("./client/funcs/listStations.js");

        console.log('RadioX ' + this.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2022 EximiaBots by Warén Group');
        console.log('');

        this.funcs.logger("Bot", "Starting");

        this.funcs.logger("Maintenance Mode", "Enabled");
        this.config.maintenanceMode = true;

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

        this.on("error", error => {
            this.funcs.logger("Discord Client / Error");
            console.error(error);
            console.log('');
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

        process.on('warning', (warning) => {
            require(`${events}warning`).execute(this, warning);
        });

        this.login(this.config.token).catch((err) => {
            this.funcs.logger("Discord Client / Error");
            console.log(err);
            console.log('');
        });
    }
}

export default RadioClient
