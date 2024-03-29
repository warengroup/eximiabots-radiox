import RadioClient from "../../Client";
import Datastore, { datastore } from "../classes/Datastore";
import Radio from "../classes/Radio";
import Stations from "../classes/Stations";
import Streamer from "../classes/Streamer";
import Statistics from "../classes/Statistics";
import commands from "../commands";
import { OAuth2Guild } from "discord.js";

export default async function ready(client: RadioClient) {
    client.funcs.logger("Bot", "Ready");

    /*DATASTORE*/
    client.funcs.logger('Datastore', 'Initialize');
    client.datastore = new Datastore();

    client.datastore.map.forEach((datastore: datastore) => {
        client.funcs.logger('Datastore', datastore.guild.id + " / " + datastore.guild.name);
    });

    client.funcs.logger('Datastore', 'Ready');

    /*DEVELOPERS*/
    let developers : string[] = [];
    for(let devID of client.config.devIDs){
        developers.push((await client.users.fetch(devID)).tag);
    }
    client.funcs.logger('Developers', developers.join(" & "));

    /*STATIONS*/
    client.stations = new Stations();

    await client.stations.fetch({
        url: client.config.stationslistUrl,
        show: true
    });

    client.streamer = new Streamer();
    client.streamer.init(client);

    if(!client.stations) {
        client.user?.setStatus('dnd');
    }

    /*GUILDS*/
    client.funcs.logger('Guilds', 'Started fetching list');

    let guilds = await client.guilds.fetch();
    guilds.forEach((guild: OAuth2Guild) => {
        client.funcs.logger('Guilds', guild.id + " / " + guild.name);
    });

    client.funcs.logger('Guilds', 'Successfully fetched list');

    /*STATISTICS*/
    client.statistics = new Statistics();
    client.statistics.calculateGlobal(client);

    /*COMMANDS*/
    commands(client);

    /*RADIO*/
    client.radio = new Radio();

    setTimeout(function () {
        /*RESTORE RADIOS*/
        client.radio?.restore(client, guilds);
    }, 5000);

    setTimeout(function () {
        if(client.stations) {
            /*MAINTENANCE MODE*/
            client.funcs.logger("Maintenance Mode", "Disabled");
            client.config.maintenanceMode = false;
        }
    }, 10000);
}
