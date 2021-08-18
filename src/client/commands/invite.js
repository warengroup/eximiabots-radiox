const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'invite',
    alias: 'i',
    usage: '',
    description: 'Invite Bot',
    permission: 'none',
    category: 'info',
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite Bot'),
    execute(interaction, client, Discord, command) {
        let message = {};
        message.inviteTitle = client.messages.inviteTitle.replace("%client.user.username%", client.user.username);
        const embed = new Discord.MessageEmbed()
            .setTitle(message.inviteTitle)
            .setColor(client.config.embedColor)
            .setURL("https://discordapp.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=2184465408&scope=applications.commands%20bot") //View Channels, Send Messages, Embed Links, Use External Emojis, Use Slash Commands, Connect, Speak, Use Voice Activity
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return interaction.reply({ embeds: [embed] });
    }
};