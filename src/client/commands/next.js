module.exports = {
    name: 'next',
    description: 'Next Station',
    category: 'radio',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);

            let index = client.stations.findIndex(station => station.name == radio.station.name) + 1;
            if(index == client.stations.length) index = 0;

            let station = client.stations[index];

            if(!station) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noSearchResults,
                ephemeral: true
            });

            client.funcs.statisticsUpdate(client, interaction.guild, radio);

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();

            if(interaction.isCommand()) {
                client.funcs.play(client, interaction, interaction.guild, station);
            }
            if(interaction.isButton()) {
                interaction.deferUpdate();
                client.funcs.play(client, null, interaction.guild, station);
            }
        }
    }
}
