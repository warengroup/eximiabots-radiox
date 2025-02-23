import { ButtonInteraction, ChatInputCommandInteraction, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { command } from "../commands";
import { station } from "../classes/Stations"

export default {
    name: 'prev',
    description: 'Previous Station',
    category: 'radio',
    async execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient, command: command) {
        if (client.funcs.check(client, interaction, command)) {
            if(!interaction.guild) return;
            const radio = client.radio?.get(interaction.guild?.id);
            if(!radio) return;

            if(client.config.maintenanceMode){
                return interaction.reply({
                    content: client.messages.emojis["error"] + client.messages.maintenance,
                    flags: 'Ephemeral'
                });
            }

            if(!client.stations) {
                return interaction.reply({
                    content: client.messages.emojis["error"] + client.messages.replace(client.messages.errorToGetPlaylist, {
                        "%client.config.supportGuild%": client.config.supportGuild
                    }),
                    flags: 'Ephemeral'
                });
            }

            let index = client.stations.findIndex((station: station) => station.name == radio.station.name) - 1;
            if(index == -1) index = client.stations.length - 1;

            let station = client.stations[index];

            if(!station) return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.noSearchResults,
                flags: 'Ephemeral'
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
