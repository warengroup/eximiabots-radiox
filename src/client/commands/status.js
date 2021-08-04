module.exports = {
    name: 'status',
    alias: 'none',
    usage: '',
    description: 'Bot Status',
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, command) {
        let message = {};

        message.statusTitle = client.messages.statusTitle.replace("%client.user.username%", client.user.username);
        let uptime = client.funcs.msToTime(client.uptime, "dd:hh:mm:ss");

        const embed = new Discord.MessageEmbed()
            .setTitle(message.statusTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .addField(client.messages.statusField1, Date.now() - msg.createdTimestamp + "ms", true)
            .addField(client.messages.statusField2, client.ws.ping + "ms", true)
            .addField(client.messages.statusField3, uptime, true)
            .addField(client.messages.statusField4, client.config.version, true)
            .addField(client.messages.statusField5, client.config.hostedBy, true)
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        msg.channel.send({ embeds: [embed] });

    }
};