module.exports = {
    name: 'maintenance',
    alias: 'm',
    usage: '',
    description: 'Bot Maintenance',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.maintenanceTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(client.messages.maintenanceDescription)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send(embed);
    }
};