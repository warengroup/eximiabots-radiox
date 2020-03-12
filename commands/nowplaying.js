module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, prefix) {
        const radio = client.radio.get(msg.guild.id);
        if (!radio || !radio.playing) return msg.channel.send('There is nothing playing.');
        radio.time = radio.connection.dispatcher.streamTime;
        const completed = (radio.time.toFixed(0));

        const embed = new Discord.MessageEmbed()
            .setTitle("Now Playing")
            .setColor(client.config.embedColor)
            .setDescription(`**${radio.station.name}** \n Owner: ${radio.station.owner} \n\`${client.funcs.msToTime(completed, "hh:mm:ss")}\``)
            .setFooter('EximiaBots by Warén Media');
        return msg.channel.send(embed);
    }
};