import { ButtonInteraction, ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { station } from "../classes/Stations"

export default {
    name: 'next',
    description: 'Next Station',
    category: 'radio',
    async execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient, command: any) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio?.get(interaction.guild?.id);

            if(!client.stations) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.maintenance,
                ephemeral: true
            });

            let index: number = client.stations.findIndex((station: station) => station.name == radio.station.name) + 1;
            if(index == client.stations?.length) index = 0;

            let station = client.stations[index];

            if(!station) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noSearchResults,
                ephemeral: true
            });

            client.statistics?.update(client, interaction.guild, radio);

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();

            if(interaction.isChatInputCommand()) {
                client.funcs.play(client, interaction, interaction.guild, station);
            }
            if(interaction.isButton()) {
                interaction.deferUpdate();
                client.funcs.play(client, null, interaction.guild, station);
            }
        }
    }
}
