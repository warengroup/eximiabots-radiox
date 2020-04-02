module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        let message = {};
        const radio = client.radio.get(msg.guild.id);
        if (!radio) return msg.channel.send('There is nothing playing.');
        const completed = (radio.connection.dispatcher.streamTime.toFixed(0));

        message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
        message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
        message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed, \"hh:mm:ss\")%", client.funcs.msToTime(completed, "hh:mm:ss"));

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.nowplayingTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(message.nowplayingDescription)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send(embed);
    }
};