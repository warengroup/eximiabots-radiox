import Discord from "discord.js";

module.exports = {
    name: 'stop',
    description: 'Stop radio',
    category: 'radio',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);
            client.funcs.statisticsUpdate(client, interaction.guild, radio);
            radio.connection?.destroy();
            client.funcs.logger('Radio', interaction.guild.id + " / " + 'Stop');

            const embed = new Discord.MessageEmbed()
                .setTitle(client.user.username)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["stop"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .addField(client.messages.nowplayingTitle, "-", true)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

            if(!radio.message){
                radio.message = radio.textChannel.send({ embeds: [embed], components: [] });
            } else {
                radio.message.edit({ embeds: [embed], components: [] });
            }

            setTimeout(async function() {
                await radio.message?.delete();
            }, 5000);

            client.radio.delete(interaction.guild.id);

            interaction.reply({
                content: client.messageEmojis["stop"] + client.messages.stop,
                ephemeral: true
            });
        }
    }
};
