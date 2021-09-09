import Discord from "discord.js";

module.exports = {
    name: 'invite',
    description: 'Invite Bot',
    category: 'info',
    execute(interaction, client) {
        let message = {};
        message.inviteTitle = client.messages.inviteTitle.replace("%client.user.username%", client.user.username);
        const embed = new Discord.MessageEmbed()
            .setTitle(message.inviteTitle)
            .setColor(client.config.embedColor)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=2184465408&scope=applications.commands%20bot") //View Channels, Send Messages, Embed Links, Use External Emojis, Use Slash Commands, Connect, Speak, Use Voice Activity
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
