module.exports = function (client, msg, command) {
    let message = {};
    const radio = client.radio.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!radio || !radio.playing){
        msg.channel.send(client.messages.notPlaying);
        return false;
    }
    if (msg.member.voice.channel !== radio.voiceChannel){
        msg.channel.send(client.messages.wrongVoiceChannel);
        return false;
    }
    if (!permissions.has(command.permission)) {
        message.noPerms = client.messages.noPerms.replace("%commands.permissions%", commands.permissions);
        msg.channel.send(message.noPerms);
        return false;
    } else return true;
};
