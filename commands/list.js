module.exports = {
    name: 'list',
    alias: 'l',
    usage: '',
    description: 'List radio stations.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        let stations = `${client.stations.map(s => `**#** ${s.name}`).join('\n')}`
        const hashs = stations.split('**#**').length;
        for (let i = 0; i < hashs; i++) {
            stations = stations.replace('**#**', `**${i + 1}**`);
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.listTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["list"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(stations)
            .setFooter('EximiaBots by Warén Media', 'https://cdn.discordapp.com/emojis/687022937978568760.png');
        return msg.channel.send(embed);
    }
};