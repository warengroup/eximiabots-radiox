module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, prefix) {
        const radio = client.radio.get(msg.guild.id);
        if (!radio) return msg.channel.send('<:redx:674263474704220182> There is nothing playing.');
        if (!radio.playing) return msg.channel.send('<:redx:674263474704220182> There is nothing playing.');
        radio.time = radio.connection.dispatcher.streamTime;
        const completed = (radio.time.toFixed(0));
        const embed = new Discord.MessageEmbed()
            .setTitle("__Now playing__")
            .setDescription(`<a:aNotes:674602408105476106>**Now playing:** ${radio.url}\n\`${client.funcs.msToTime(completed, "hh:mm:ss")}\``)
            .setColor(client.config.embedColor)
        return msg.channel.send(embed);
    }
};

