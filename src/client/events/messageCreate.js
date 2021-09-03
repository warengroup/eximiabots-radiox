import Discord from "discord.js";
module.exports = {
    name: 'messageCreate',
    async execute(client, message) {

        if (message.author.bot || !message.guild) return;
        let prefix = "rx$";
        if(client.user.username == "RadioX"){
            prefix = "rx>";
        } else if (client.user.username == "RadioX Beta"){
            prefix = "rx-";
        } else if (client.user.username == "RadioX Dev"){
            prefix = "rx$";
        } else if(message.mentions.members.first() && message.mentions.members.first().user.id === client.user.id){
            prefix = "<@!" + client.user.id + "> ";
        } else {
            return;
        }
        
        const args = message.content.slice(prefix.length).split(' ');
        if (!message.content.startsWith(prefix)) return;
        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        if (commandName === 'none') return;
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && message.content !== `${prefix}`) return;
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has('EMBED_LINKS')) return message.channel.send(client.messages.noPermsEmbed);
        try {
            let newMessage = {};

            newMessage.messageCommandsDeprecatedTitle = client.messages.messageCommandsDeprecatedTitle.replace("%client.user.username%", client.user.username);
    
            const embed = new Discord.MessageEmbed()
                .setTitle(newMessage.messageCommandsDeprecatedTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .setDescription(client.messages.messageCommandsDeprecatedDescription)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

            let msg = await message.channel.send({ embeds: [embed] });

            setTimeout(function() {
                msg.delete();
            }, 30000);
        } catch (error) {
            message.reply({
                content: client.messages.runningCommandFailed,
                ephemeral: true
            });
            console.error(error);
        }
    }
}