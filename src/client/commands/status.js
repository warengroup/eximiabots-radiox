import Discord from "discord.js";

module.exports = {
    name: 'status',
    description: 'Bot Status',
    category: 'info',
    async execute(interaction, client) {
        let message = {};

        message.statusTitle = client.messages.statusTitle.replace("%client.user.username%", client.user.username);
        let uptime = client.funcs.msToTime(client.uptime);

        const embed = new Discord.MessageEmbed()
            .setTitle(message.statusTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .addField(client.messages.statusField1, uptime, false)
            .addField(client.messages.statusField2, client.config.version, false)
            .addField(client.messages.statusField3, Date.now() - interaction.createdTimestamp + "ms", false)
            .addField(client.messages.statusField4, client.ws.ping + "ms", false)
            .addField(client.messages.statusField5, client.config.hostedBy, false)
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
