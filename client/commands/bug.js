module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, command) {
        let message = {};

        message.bugTitle = client.messages.bugTitle.replace("%client.user.username%", client.user.username);
        message.bugDescription = client.messages.bugDescription.replace("%client.developers%", client.developers);
        message.bugDescription = message.bugDescription.replace("%client.config.supportGuild%", client.config.supportGuild);

        const embed = new Discord.MessageEmbed()
            .setTitle(message.bugTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(message.bugDescription)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        msg.channel.send(embed);

    },
};