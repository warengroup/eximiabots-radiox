import { ActionRowBuilder, ButtonInteraction, ChatInputCommandInteraction, SelectMenuComponentOptionData, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";

export default function listStations(client: RadioClient, interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction){
    if(!client.stations) return;

    let options : SelectMenuComponentOptionData[] = new Array();

    for (const station of client.stations){
        options.push({
            label: station.name,
            description: station.owner,
            value: station.name
        });
    }

    const menu: ActionRowBuilder<any> = new ActionRowBuilder()
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
