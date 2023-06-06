import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import RadioClient from "../../Client";

export default {
    name: 'invite',
    description: 'Invite Bot',
    category: 'info',
    execute(interaction: ChatInputCommandInteraction, client: RadioClient) {

        if(!client.user) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            ephemeral: true
        });

        let message: any = {};
        const embed = new EmbedBuilder()
            .setTitle(client.messages.replace(client.messages.inviteTitle, {
                "%client.user.username%": client.user.username
            }))
            .setColor(client.config.embedColor as ColorResolvable)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=2184465408&scope=applications.commands%20bot") //View Channels, Send Messages, Embed Links, Use External Emojis, Use Slash Commands, Connect, Speak, Use Voice Activity
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
