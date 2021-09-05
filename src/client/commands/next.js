module.exports = {
    name: 'next',
    description: 'Next Station',
    permission: 'none',
    category: 'info',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);
            console.log(client.stations.find(station => station.name == radio.station.name));
        }
    }
}