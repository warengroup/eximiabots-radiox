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
            .setDescription(`**${radio.station.name}** \n Owner: ${radio.station.owner} \n\`${msToTime(completed, "hh:mm:ss")}\``)
            .setFooter('EximiaBots by Warén Media');
        return msg.channel.send(embed);
    }
};
function msToTime(duration, format) {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 24);

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (format === "hh:mm:ss") {
        return `${hours}:${minutes}:${seconds}`;
    } else if (format === "dd:hh:mm:ss") {
        return `${days}:${hours}:${minutes}:${seconds}`;
    }
}