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
            .setURL(client.config.invite)
            .setColor(client.config.embedColor)
        return msg.channel.send(embed);
    }
};