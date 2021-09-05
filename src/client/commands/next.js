module.exports = {
    name: 'next',
    description: 'Next Station',
    permission: 'none',
    category: 'info',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);
            let station = client.stations[client.stations.findIndex(station => station.name == radio.station.name) + 1];
            
            client.funcs.statisticsUpdate(client, interaction.guild, radio);
            radio.audioPlayer.stop();
            
            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();
            client.funcs.play(interaction, interaction.guild, client, url);

            return;
        }
    }
}