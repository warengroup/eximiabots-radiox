module.exports = function (client, msg, command) {
    let message = {};
    const radio = client.radio.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!radio) {
        msg.channel.send(client.messageEmojis["error"] + client.messages.notPlaying);
        return false;
    }
    if (msg.member.voice.channel !== radio.voiceChannel) {
        msg.channel.send(client.messageEmojis["error"] + client.messages.wrongVoiceChannel);
        return false;
    }
    if(!command.permission == 'none'){
        if (!permissions.has(command.permission)) {
            message.noPerms = client.messages.noPerms.replace("%command.permission%", command.permission);
            msg.channel.send(client.messageEmojis["error"] + message.noPerms);
            return false;
        } else return true;
    } else return true;
};
