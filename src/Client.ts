import { Client, Collection, IntentsBitField } from "discord.js";
import Datastore from "./client/classes/Datastore";
import Radio from "./client/classes/Radio";
import Stations from "./client/classes/Stations";
import Streamer from "./client/classes/Streamer";
import Statistics from "./client/classes/Statistics";
import { command } from "./client/utils/typings";
import config from "./config";
import messages from "./client/messages";

const events = "./client/events/";

const GatewayIntents = new IntentsBitField();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 7, // GUILD_VOICE_STATES
    1 << 9 // GUILD_MESSAGES
);

export default class RadioClient extends Client {
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
        this.funcs.check = require("./client/funcs/check");
        this.funcs.isDev = require("./client/funcs/isDev");
        this.funcs.logger = require("./client/funcs/logger");
        this.funcs.msToTime = require("./client/funcs/msToTime");
        this.funcs.saveState = require("./client/funcs/saveState");
        this.funcs.loadState = require("./client/funcs/loadState");
        this.funcs.play = require("./client/funcs/play");
        this.funcs.listStations = require("./client/funcs/listStations");

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
