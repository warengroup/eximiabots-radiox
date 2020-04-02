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
            .setColor(client.config.embedColor)
            .setURL(client.config.invite)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send(embed);
    }
};