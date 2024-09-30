import { Guild } from "discord.js";
import RadioClient from "../../Client";
import { radio } from "../classes/Radio";

export default function saveState(client: RadioClient, guild: Guild | { id: string, name?: string } | undefined, radio: radio){
    if(!client.datastore || !guild) return;
    client.datastore.checkEntry(guild.id);

    let date = new Date();

    let data = client.datastore.getEntry(guild.id);
    if(!data) return;
    data.state = {
        channels: {
            text: radio.textChannel?.id,
            voice: radio.voiceChannel?.id
        },
        date: date.toISOString(),
        station: {
            name: radio.station.name,
            owner: radio.station.owner
        }
    };

    client.datastore.updateEntry(guild, data);
}
