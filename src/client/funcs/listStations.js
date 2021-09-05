import Discord from "discord.js";

module.exports = function (client, interaction){
    let stations = new Array();

    let options = new Array();
    options[1] = new Array();
    options[2] = new Array();

    stations[1] = client.stations.slice(0,24).forEach(station => {
        station = {
            label: station.name,
            description: station.owner,
            value: station.name
        };
        options[1].push(station);
    });

    stations[2] = client.stations.slice(25).forEach(station => {
        station = {
            label: station.name,
            description: station.owner,
            value: station.name
        };
        options[2].push(station);
    });

    const menu = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('play')
                .setPlaceholder('Nothing selected')
                .addOptions(options[1])
                .addOptions(options[2])
        );

    stations = null;
    options = null;

    return interaction.reply({
        content: '**Select station:**',
        components: [menu],
        ephemeral: true
    });
}