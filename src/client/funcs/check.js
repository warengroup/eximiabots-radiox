module.exports = function (client, interaction, command) {
    let message = {};
    const radio = client.radio.get(interaction.guild.id);
    const permissions = interaction.channel.permissionsFor(interaction.user);
    if(!client.stations) {
        message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
        interaction.reply({
            content: client.messageEmojis["error"] + message.errorToGetPlaylist,
            ephemeral: true
        });
        return false;
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

    return true;
};
