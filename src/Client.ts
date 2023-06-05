import { Client, Collection, IntentsBitField } from "discord.js";
import Datastore from "./client/classes/Datastore";
import Radio from "./client/classes/Radio";
import Stations from "./client/classes/Stations";
import Streamer from "./client/classes/Streamer";
import Statistics from "./client/classes/Statistics";
import { command } from "./client/commands";
import config from "./config";
import { events } from "./client/events"
import { funcs } from "./client/funcs";
import { messages } from "./client/messages";


const GatewayIntents = new IntentsBitField();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 7, // GUILD_VOICE_STATES
    1 << 9 // GUILD_MESSAGES
);

export default class RadioClient extends Client {
    readonly commands: Collection<string, command>;
    readonly events = events;
    readonly funcs = funcs;
    readonly config = config;
    readonly messages = messages;
    public datastore: Datastore | null;
    public stations: Stations | null;
    public streamer: Streamer | null;
    public statistics: Statistics | null;
    public radio: Radio | null;
    public developers: string | undefined;

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

        console.log('RadioX ' + this.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2022 EximiaBots by Warén Group');
        console.log('');

        this.funcs.logger("Bot", "Starting");

        this.funcs.logger("Maintenance Mode", "Enabled");
        this.config.maintenanceMode = true;

        this.on("ready", () => {
            this.events.ready.execute(this);
        });

        this.on("messageDelete", msg => {
            this.events.messageDelete.execute(this, msg);
        });

        this.on("interactionCreate", interaction => {
            this.events.interactionCreate.execute(this, interaction);
        });

        this.on("voiceStateUpdate", (oldState, newState) => {
            this.events.voiceStateUpdate.execute(this, oldState, newState);
        });

        this.on("error", error => {
            this.funcs.logger("Discord Client", "Error");
            console.error(error);
            console.log('');
        });

        process.on('SIGINT', () => {
            this.events.SIGINT.execute(this);
        });

        process.on('SIGTERM', () => {
            this.events.SIGTERM.execute(this);
        });

        process.on('uncaughtException', (error) => {
            this.events.uncaughtException.execute(this, error);
        });

        process.on('exit', () => {
            this.funcs.logger("Bot", "Stopping");
        });

        process.on('warning', (warning) => {
            this.events.warning.execute(this, warning);
        });

        this.login(this.config.token).catch((err) => {
            this.funcs.logger("Discord Client", "Login Error");
            console.log(err);
            console.log('');
        });
    }
}
