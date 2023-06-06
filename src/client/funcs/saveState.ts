import { Guild } from "discord.js";
import RadioClient from "../../Client";
import { radio } from "../classes/Radio";

export default function saveState(client: RadioClient, guild: Guild, radio: radio){
    if(!client.datastore) return;
    client.datastore.checkEntry(guild.id);

    let date = new Date();

    let data = client.datastore.getEntry(guild.id);

    data.state = {};
    data.state.channels = {};
    data.state.channels.text = radio.textChannel?.id;
    data.state.channels.voice = radio.voiceChannel.id;
    data.state.date = date.toISOString();
    data.state.station = {};
    data.state.station.name = radio.station.name;
    data.state.station.owner = radio.station.owner;

    client.datastore.updateEntry(guild, data);
}
