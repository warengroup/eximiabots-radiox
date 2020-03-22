module.exports = function (client, msg, command) {
    let message = {};
    const radio = client.radio.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!radio) {
        msg.channel.send(client.messageEmojis["x"] + client.messages.notPlaying);
        return false;
    }
    if (msg.member.voice.channel !== radio.voiceChannel) {
        msg.channel.send(client.messageEmojis["x"] + client.messages.wrongVoiceChannel);
        return false;
    }
    if (!permissions.has(command.permission)) {
        message.noPerms = client.messages.noPerms.replace("%commands.permissions%", commands.permissions);
        msg.channel.send(client.messageEmojis["x"] + message.noPerms);
        return false;
    } else return true;
};
