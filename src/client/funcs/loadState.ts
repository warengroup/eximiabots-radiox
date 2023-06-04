import { Guild } from "discord.js";

export default function loadState(client: any, guild: Guild){
    let data = client.datastore.getEntry(guild.id);
    if(!data) return;
    let state;

    state = data.state;
    if(!state) return;

    data.state = {};
    client.datastore.updateEntry(guild, data);
    return state;
}
