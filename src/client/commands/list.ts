import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { station } from "../classes/Stations";

export default {
    name: 'list',
    description: 'List radio stations',
    category: 'radio',
    execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {

        if(client.config.maintenanceMode){
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.maintenance,
                ephemeral: true
            });
        }

        if(!client.stations) {
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.replace(client.messages.errorToGetPlaylist, {
                    "%client.config.supportGuild%": client.config.supportGuild
                }),
                ephemeral: true
            });
        }

        const radio = client.radio?.get(interaction.guild?.id);

        if(radio && !client.config.maintenanceMode){
            client.funcs.listStations(client, interaction);
        } else {
            let stations = `${client.stations.map((s: station) => `**#** ${s.name}`).join('\n')}`
            const hashs = stations.split('**#**').length;
            for (let i = 0; i < hashs; i++) {
                stations = stations.replace('**#**', `**${i + 1}.**`);
            }

            let embed = new EmbedBuilder()
                .setTitle(client.messages.listTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["list"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .setDescription(stations)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter({
                    text: client.messages.footerText,
                    iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
                });

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};
