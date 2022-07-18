import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";

module.exports = function listStations(client, interaction){
    let stations = new Array();
    let options = new Array();

    stations = client.stations.forEach(station => {
        if(station.name == "GrooveFM") return;
        station = {
            label: station.name,
            description: station.owner,
            value: station.name
        };
        options.push(station);
    });

    const menu = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('play')
                .setPlaceholder('Nothing selected')
                .addOptions(options)
        );

    stations = null;
    options = null;

    return interaction.reply({
        content: '**Select station:**',
        components: [menu],
        ephemeral: true
    });
}
