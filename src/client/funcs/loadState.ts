import { OAuth2Guild } from "discord.js";
import RadioClient from "../../Client";

export default function loadState(client: RadioClient, guild: OAuth2Guild) {
    if(!client.datastore) return;
    let data = client.datastore.getEntry(guild.id);
    if(!data) return;
    let state = data.state;
    if(!state) return;
    data.state = null;
    client.datastore.updateEntry(guild, data);
    return state;
}
