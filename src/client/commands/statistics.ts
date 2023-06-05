import { ButtonInteraction, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";


export default {
    name: 'statistics',
    description: 'Show statistics',
    category: 'info',
    execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {
        let message: any = {};

        if(!interaction.guild) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            ephemeral: true
        });

        let stations = client.stations;
        let currentGuild = client.datastore?.getEntry(interaction.guild.id);
        let global = client.datastore?.getEntry("global");
        let statistics = "";

        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messages.emojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        if(!currentGuild || currentGuild && !currentGuild.statistics){
            statistics = "You have not listened any radio stations";
        } else {
            statistics = "[Open Dashboard](https://eximiabots.waren.io/radiox/" + interaction.guild.id + "/stats?info=" + Buffer.from(JSON.stringify(currentGuild), 'utf8').toString('base64') + "&globalInfo=" + Buffer.from(JSON.stringify(global), 'utf8').toString('base64') + ")" + "\n";
        }

        const embed = new EmbedBuilder()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["statistics"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor as ColorResolvable)
            .setDescription(statistics)
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
};
