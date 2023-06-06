import RadioClient from "../../Client";
import Datastore from "../classes/Datastore";
import Radio from "../classes/Radio";
import Stations from "../classes/Stations";
import Streamer from "../classes/Streamer";
import Statistics from "../classes/Statistics";
import commands from "../commands";

export default async function ready(client: RadioClient) {
    client.funcs.logger("Bot", "Ready");

    /*DATASTORE*/
    client.funcs.logger('Datastore', 'Initialize');
    client.datastore = new Datastore();

    client.datastore.map.forEach((datastore: { guild: { id: string; name: string; }; }) => {
        client.funcs.logger('Datastore', datastore.guild.id + " / " + datastore.guild.name);
    });

    client.funcs.logger('Datastore', 'Ready');

    /*DEVELOPERS*/
    client.developers = "";
    let user : any= "";
    for (let i = 0; i < client.config.devId.length; i++) {
        user = await client.users.fetch(client.config.devId[i]);
        client.funcs.logger('Developers', user.tag);
        if (i == client.config.devId.length - 1) {
            client.developers += user.tag;
        } else {
            client.developers += user.tag + " & ";
        }
    }

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
    guilds.forEach((guild: { id: string; name: string; }) => {
        client.funcs.logger('Guilds', guild.id + " / " + guild.name);
    });

    client.funcs.logger('Guilds', 'Successfully fetched list');

    /*STATISTICS*/
    client.statistics = new Statistics();
    client.statistics.calculateGlobal(client);

    /*COMMANDS*/
    commands.execute(client);

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
