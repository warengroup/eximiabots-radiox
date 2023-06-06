import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import RadioClient from "../../Client";

export default {
    name: 'help',
    description: 'Get help using bot',
    category: 'info',
    execute(interaction: ChatInputCommandInteraction, client: RadioClient) {

        if(!client.user) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            ephemeral: true
        });

        const categories : any= [];
        for (let i = 0; i < client.commands.size; i++) {
            if (!categories.includes([...client.commands.values()][i].category)) categories.push([...client.commands.values()][i].category);
        }
        let commands = '';
        for (let i = 0; i < categories.length; i++) {
            commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i]).map((x: { name: any; }) => `\`${x.name}\``).join(', ')}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(client.messages.replace(client.messages.helpTitle, {
                "%client.user.username%": client.user.username
            }))
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor as ColorResolvable)
            .setDescription(client.messages.replace(client.messages.helpDescription, {
                "%commands%": commands
            }))
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
