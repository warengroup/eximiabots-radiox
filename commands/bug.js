module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, prefix) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Found a bug with ${client.user.username}?\nDM the core developer:`)
            .setColor(client.config.embedColor)
            .setDescription(`${client.developers}\nOr join the support server: ${client.config.supportGuild}`)
            .setFooter('EximiaBots by Warén Media');
        msg.channel.send(embed);
    },
};