module.exports = {
    name: 'status',
    description: 'Bot Status',
    permission: 'none',
    category: 'info',
    async execute(interaction, client, Discord) {
        let message = {};

        message.statusTitle = client.messages.statusTitle.replace("%client.user.username%", client.user.username);
        let uptime = client.funcs.msToTime(client.uptime);

        const embed = new Discord.MessageEmbed()
            .setTitle(message.statusTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .addField(client.messages.statusField1, Date.now() - interaction.createdTimestamp + "ms", true)
            .addField(client.messages.statusField2, client.ws.ping + "ms", true)
            .addField(client.messages.statusField3, uptime, true)
            .addField(client.messages.statusField4, client.config.version, true)
            .addField(client.messages.statusField5, client.config.hostedBy, true)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
};