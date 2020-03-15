module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, prefix) {
        let message = {};
        
        message.bugTitle = client.messages.bugTitle.replace("%client.user.username%", client.user.username);
        message.bugDescription = client.messages.bugDescription.replace("%client.developers%", client.developers);
        message.bugDescription = message.bugDescription.replace("%client.config.supportGuild%", client.config.supportGuild);
        
        const embed = new Discord.MessageEmbed()
            .setTitle(message.bugTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/686296221433725076.png")
            .setColor(client.config.embedColor)
            .setDescription(message.bugDescription)
            .setFooter('EximiaBots by Warén Media', 'https://cdn.discordapp.com/emojis/687022937978568760.png');
        msg.channel.send(embed);
        
    },
};