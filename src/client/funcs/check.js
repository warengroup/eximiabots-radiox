module.exports = function (client, interaction, command) {
    let message = {};
    const radio = client.radio.get(interaction.guild.id);
    const permissions = interaction.channel.permissionsFor(interaction.user);
    if (!radio) {
        interaction.reply(client.messageEmojis["error"] + client.messages.notPlaying);
        return false;
    }
    if (interaction.member.voice.channel !== radio.voiceChannel) {
        interaction.reply(client.messageEmojis["error"] + client.messages.wrongVoiceChannel);
        return false;
    }
    if(!command.permission == 'none'){
        if (!permissions.has(command.permission)) {
            message.noPerms = client.messages.noPerms.replace("%command.permission%", command.permission);
            interaction.reply(client.messageEmojis["error"] + message.noPerms);
            return false;
        } else return true;
    } else return true;
};
