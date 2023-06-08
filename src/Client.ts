import { Client, Collection, IntentsBitField } from "discord.js";
import Datastore from "./client/classes/Datastore";
import Radio from "./client/classes/Radio";
import Stations from "./client/classes/Stations";
import Streamer from "./client/classes/Streamer";
import Statistics from "./client/classes/Statistics";
import { command } from "./client/commands";
import config from "./config";
import events from "./client/events"
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
    readonly funcs = funcs;
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

        console.log('RadioX ' + this.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2022 EximiaBots by Warén Group');
        console.log('');

        this.funcs.logger("Bot", "Starting");

        this.funcs.logger("Maintenance Mode", "Enabled");
        this.config.maintenanceMode = true;

        events(this);

        this.login(this.config.token).catch((err) => {
            this.funcs.logger("Discord Client", "Login Error");
            console.log(err);
            console.log('');
        });
    }
}
