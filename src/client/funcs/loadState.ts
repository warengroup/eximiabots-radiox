import { Guild } from "discord.js";
import RadioClient from "../../Client";

export default function loadState(client: RadioClient, guild: Guild){
    if(!client.datastore) return;
    let data = client.datastore.getEntry(guild.id);
    if(!data) return;
    let state;

    state = data.state;
    if(!state) return;

    data.state = {};
    client.datastore.updateEntry(guild, data);
    return state;
}
