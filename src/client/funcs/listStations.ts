import { ActionRowBuilder, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import RadioClient from "../../Client";
import { station } from "../classes/Stations";

export default function listStations(client: RadioClient, interaction: any){
    if(!client.stations) return;

    let options : SelectMenuComponentOptionData[] = new Array();

    client.stations.forEach((station: station) => {
        if(station.name == "GrooveFM") return;
        options.push({
            label: station.name,
            description: station.owner,
            value: station.name
        });
    });

    const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('play')
                .setPlaceholder('Nothing selected')
                .addOptions(options)
        );

    return interaction.reply({
        content: '**Select station:**',
        components: [menu],
        ephemeral: true
    });
}
