module.exports = {
    name: 'prev',
    description: 'Previous Station',
    category: 'radio',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);

            let index = client.stations.findIndex(station => station.name == radio.station.name) - 1;
            if(index == -1) index = client.stations.length - 1;

            let station = client.stations[index];

            if(!station) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noSearchResults,
                ephemeral: true
            });

            let url = station.stream[station.stream.default];

            client.funcs.statisticsUpdate(client, interaction.guild, radio);
            radio.audioPlayer.stop();

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();

            if(interaction.isCommand()) {
                client.funcs.play(interaction, interaction.guild, client, url);
            }
            if(interaction.isButton()) {
                interaction.deferUpdate();
                client.funcs.play(null, interaction.guild, client, url);
            }

        }
    }
}
