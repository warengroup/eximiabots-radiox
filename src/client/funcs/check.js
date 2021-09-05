module.exports = function (client, interaction, command) {
    let message = {};
    const radio = client.radio.get(interaction.guild.id);
    const permissions = interaction.channel.permissionsFor(interaction.user);
    if(!client.stations) {
        message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
        return interaction.reply({
            content: client.messageEmojis["error"] + message.errorToGetPlaylist,
            ephemeral: true
        });
    }
    if (!radio) {
        interaction.reply({
            content: client.messageEmojis["error"] + client.messages.notPlaying,
            ephemeral: true
        });
        return false;
    }
    if (interaction.member.voice.channel !== radio.voiceChannel) {
        interaction.reply({
            content: client.messageEmojis["error"] + client.messages.wrongVoiceChannel,
            ephemeral: true
        });
        return false;
    }
    if(!command.permission == 'none'){
        if (!permissions.has(command.permission)) {
            message.noPerms = client.messages.noPerms.replace("%command.permission%", command.permission);
            interaction.reply({
                content: client.messageEmojis["error"] + message.noPerms,
                ephemeral: true
            });
            return false;
        } else return true;
    } else return true;
};
