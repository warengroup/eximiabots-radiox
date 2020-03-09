module.exports = {
    name: 'list',
    alias: 'l',
    usage: '',
    description: 'List radio stations.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix) {
        let stations = `${client.stations.map(s => `**#** ${s.name}`).join('\n')}`
        const hashs = stations.split('**#**').length;
        for (let i = 0; i < hashs; i++) {
            stations = stations.replace('**#**', `**${i + 1}**`);
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`Radio Stations`)
            .setColor(client.config.embedColor)
            .setDescription(stations)
            .setFooter('EximiaBots by Warén Media')
        return msg.channel.send(embed);
    }
};