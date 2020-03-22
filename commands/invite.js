module.exports = {
    name: 'invite',
    alias: 'i',
    usage: '',
    description: 'Invite RadioX.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        let message = {};
        message.inviteTitle = client.messages.inviteTitle.replace("%client.user.username%", client.user.username);
        const embed = new Discord.MessageEmbed()
            .setTitle(message.inviteTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/686296221433725076.png")
            .setColor(client.config.embedColor)
            .setURL(client.config.invite)
            .setFooter('EximiaBots by Warén Media', 'https://cdn.discordapp.com/emojis/687022937978568760.png');
        return msg.channel.send(embed);
    }
};