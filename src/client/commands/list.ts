import { ButtonInteraction, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";

export default {
    name: 'list',
    description: 'List radio stations',
    category: 'radio',
    execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {
        let message: any = {};

        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        const radio = client.radio?.get(interaction.guild?.id);

        if(radio && !client.config.maintenanceMode){
            client.funcs.listStations(client, interaction);
        } else {
            let stations = `${client.stations.map((s: { name: any; }) => `**#** ${s.name}`).join('\n')}`
            const hashs = stations.split('**#**').length;
            for (let i = 0; i < hashs; i++) {
                stations = stations.replace('**#**', `**${i + 1}.**`);
            }

            let embed = new EmbedBuilder()
                .setTitle(client.messages.listTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["list"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor as ColorResolvable)
                .setDescription(stations)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter({
                    text: client.messages.footerText,
                    iconURL: "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, '')
                });

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};
