import Discord from "discord.js";

module.exports = function (client, interaction){
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

    const menu = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
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