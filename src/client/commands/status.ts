import { ColorResolvable, EmbedBuilder } from "discord.js";
import RadioClient from "../../Client";

export default {
    name: 'status',
    description: 'Bot Status',
    category: 'info',
    async execute(interaction: any, client: RadioClient) {
        let message: any = {};

        message.statusTitle = client.messages.statusTitle.replace("%client.user.username%", client.user.username);
        let uptime = client.funcs.msToTime(client.uptime);

        const embed = new EmbedBuilder()
            .setTitle(message.statusTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor as ColorResolvable)
            .addFields(
                { name: client.messages.statusField1, value: uptime },
                { name: client.messages.statusField2, value: client.config.version },
                { name: client.messages.statusField3, value: Date.now() - interaction.createdTimestamp + "ms" },
                { name: client.messages.statusField4, value: client.ws.ping.toString() },
                { name: client.messages.statusField5, value: client.config.hostedBy }
            )
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
};
