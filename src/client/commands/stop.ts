import { EmbedBuilder } from "discord.js";

export default {
    name: 'stop',
    description: 'Stop radio',
    category: 'radio',
    async execute(interaction: any, client: any, command: any) {
        if (client.funcs.check(client, interaction, command)) {
            const radio = client.radio.get(interaction.guild.id);
            client.statistics.update(client, interaction.guild, radio);
            radio.connection?.destroy();
            client.funcs.logger('Radio', interaction.guild.id + " / " + 'Stop');

            const embed = new EmbedBuilder()
                .setTitle(client.user.username)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["stop"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .addFields({
                    name: client.messages.nowplayingTitle,
                    value: "-"
                })
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter({
                    text: client.messages.footerText,
                    iconURL: "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, '')
                });

            if(!radio.message){
                radio.message = radio.textChannel.send({ embeds: [embed], components: [] });
            } else {
                if(radio.textChannel.id == radio.message.channel.id){
                    radio.message.edit({ embeds: [embed], components: [] });
                } else {
                    radio.message?.delete();
                }
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
