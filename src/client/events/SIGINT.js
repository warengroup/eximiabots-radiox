import Discord from "discord.js";

module.exports = {
    name: 'SIGINT',
    async execute(client) {
        setTimeout(async function () {
            client.user.setStatus('idle');
            let message = {};

            if (!client.stations) return process.exit();

            let currentRadios = client.radio.keys();
            let radio = currentRadios.next();
            let stoppedRadios = "";
            client.user.setStatus('idle');

            while (!radio.done) {
                let currentRadio = await client.radio.get(radio.value);
                currentRadio.guild = await client.datastore.getEntry(radio.value).guild;

                if (currentRadio) {
                    await client.funcs.statisticsUpdate(client, currentRadio.guild, currentRadio);
                    currentRadio.connection?.destroy();
                    currentRadio.audioPlayer?.stop();
                    currentRadio.message?.delete();
                    const cembed = new Discord.MessageEmbed()
                        .setTitle(client.messages.maintenanceTitle)
                        .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
                        .setColor(client.config.embedColor)
                        .setDescription(client.messages.sendedMaintenanceMessage)
                        .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
                    currentRadio.textChannel.send({ embeds: [cembed] });
                    client.radio.delete(radio.value);
                }
                
                radio = await currentRadios.next();
            }

            

            console.log("\n");
            client.funcs.logger("Bot", "Closing");
            console.log("\n");

            client.user.setStatus('dnd');

            setTimeout(function () {
                process.exit();
            }, 5000);
        }, 5000);
    }
}