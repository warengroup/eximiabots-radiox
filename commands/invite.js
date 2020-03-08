module.exports = {
    name: 'invite',
    alias: 'i',
    usage: '',
    description: 'Invite RadioX.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Invite ${client.user.username} to your Discord server!`)
            .setColor(client.config.embedColor)
            .setURL(client.config.invite)
            .setFooter('EximiaBots by Warén Media');
        return msg.channel.send(embed);
    }
};