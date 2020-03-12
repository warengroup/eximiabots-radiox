module.exports = function (client, msg, command) {
    const radio = client.radio.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!radio || !radio.playing) return msg.channel.send(client.messages.notPlaying);
    if (msg.member.voice.channel !== radio.voiceChannel) return msg.channel.send(client.messages.wrongVoiceChannel);
    if (!permissions.has(command.permission)) {
        client.messages.noPerms = client.messages.noPerms.replace("%commands.permissions%", commands.permissions);
        msg.channel.send(client.messages.noPerms);
        return false;
    } else return true;
};
