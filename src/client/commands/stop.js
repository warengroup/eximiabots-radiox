module.exports = {
    name: 'stop',
    description: 'Stop radio',
    alias: 's',
    usage: '',
    permission: 'none',
    category: 'radio',
    execute(interaction, client, Discord, command) {
        const radio = client.radio.get(interaction.guild.id);
        if (client.funcs.check(client, interaction, command)) {
            client.funcs.statisticsUpdate(client, interaction.guild, radio);
            radio.connection?.destroy();
            radio.audioPlayer?.stop();
            client.funcs.logger('Radio', 'Stream stopped' + " / " + interaction.guild.id);
            client.radio.delete(interaction.guild.id);
            interaction.reply(client.messageEmojis["stop"] + client.messages.stop);
        }
    }
};