module.exports = {
    name: 'previous',
    usage: '',
    description: 'Previous Station',
    permission: 'none',
    category: 'info',
    async execute(interaction, client, Discord, command) {
        let message = {};
        const radio = client.radio.get(interaction.guild.id);
        if (!radio) return interaction.reply({
            content: 'There is nothing playing.',
            ephemeral: true
        });
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        
    }
}