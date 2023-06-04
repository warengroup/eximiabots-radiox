import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import RadioClient from "../../Client";

export default function listStations(client: RadioClient, interaction: any){
    let stations: any = new Array();
    let options: any = new Array();

    if(!client.stations) return;

    stations = client.stations.forEach((station: { name?: any; owner?: any; label?: any; description?: any; value?: any; }) => {
        if(station.name == "GrooveFM") return;
        station = {
            label: station.name,
            description: station.owner,
            value: station.name
        };
        options.push(station);
    });

    const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('play')
                .setPlaceholder('Nothing selected')
                .addOptions(options)
        );

    stations = null;
    options = null;

    return interaction.reply({
        content: '**Select station:**',
        components: [menu],
        ephemeral: true
    });
}
