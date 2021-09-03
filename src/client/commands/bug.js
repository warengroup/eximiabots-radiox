module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    permission: 'none',
    category: 'info',
    async execute(interaction, client, Discord, command) {
        let message = {};

        message.bugTitle = client.messages.bugTitle.replace("%client.user.username%", client.user.username);
        message.bugDescription = message.bugDescription.replace("%client.config.supportGuild%", client.config.supportGuild);

        const embed = new Discord.MessageEmbed()
            .setTitle(message.bugTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(message.bugDescription)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};