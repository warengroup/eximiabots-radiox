import { ActionRowBuilder, ButtonInteraction, ChatInputCommandInteraction, SelectMenuComponentOptionData, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";

export default function listStations(client: RadioClient, interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, offset: string){
    if(!client.stations) return;

    let options : SelectMenuComponentOptionData[] = new Array();


    for (const station of client.stations){
        options.push({
            label: station.name,
            description: station.owner,
            value: station.name
        });
    }

    switch(offset){
        case "1":
            options = options.slice(0,Math.round(options.length/2));
            break;
        case "2":
            options = options.slice(Math.round(options.length/2),options.length-1);
            break;
        default:
            options = options.slice(0,Math.round(options.length/2));
    }

    const menu = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('play')
                .setPlaceholder('Nothing selected')
                .addOptions(options)
        );

    return interaction.reply({
        content: '**Select station:**',
        components: [menu],
        flags: 'Ephemeral'
    });
}
