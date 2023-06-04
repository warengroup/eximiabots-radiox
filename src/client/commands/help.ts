import { EmbedBuilder } from "discord.js";

export default {
    name: 'help',
    description: 'Get help using bot',
    category: 'info',
    execute(interaction, client) {
        let message = {};

        const categories = [];
        for (let i = 0; i < client.commands.size; i++) {
            if (!categories.includes([...client.commands.values()][i].category)) categories.push([...client.commands.values()][i].category);
        }
        let commands = '';
        for (let i = 0; i < categories.length; i++) {
            commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp).map(x => `\`${x.name}\``).join(', ')}\n`;
        }

        message.helpTitle = client.messages.helpTitle.replace("%client.user.username%", client.user.username);
        message.helpDescription = client.messages.helpDescription.replace("%commands%", commands);

        const embed = new EmbedBuilder()
            .setTitle(message.helpTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(message.helpDescription)
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
