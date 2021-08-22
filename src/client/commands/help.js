const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'help',
    alias: 'h',
    usage: '<command(opt)>',
    description: 'Get help using bot',
    permission: 'none',
    category: 'info',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help using bot'),
    execute(interaction, client, Discord, command) {
        let message = {};

        /*if (args[1]) {
            if (!client.commands.has(args[1]) || (client.commands.has(args[1]) && client.commands.get(args[1]).omitFromHelp === true)) return interaction.reply('That command does not exist');
            const command = client.commands.get(args[1]);

            message.helpCommandTitle = client.messages.helpCommandTitle.replace("%client.config.prefix%", client.config.prefix);
            message.helpCommandTitle = message.helpCommandTitle.replace("%command.name%", command.name);
            message.helpCommandTitle = message.helpCommandTitle.replace("%command.usage%", command.usage);
            message.helpCommandDescription = client.messages.helpCommandDescription.replace("%command.description%", command.description);
            message.helpCommandDescription = message.helpCommandDescription.replace("%command.alias%", command.alias);

            const embed = new Discord.MessageEmbed()
                .setTitle(message.helpCommandTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .setDescription(message.helpCommandDescription)
                .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
            interaction.reply({ embeds: [embed] });
        } else {*/
            const categories = [];
            for (let i = 0; i < client.commands.size; i++) {
                if (!categories.includes([...client.commands.values()][i].category)) categories.push([...client.commands.values()][i].category);
            }
            let commands = '';
            for (let i = 0; i < categories.length; i++) {
                commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp).map(x => `\`${x.name}\``).join(', ')}\n`;
            }

            message.helpTitle = client.messages.helpTitle.replace("%client.user.username%", client.user.username);
            message.helpDescription = client.messages.helpDescription.replace("%commands%", commands);
            message.helpDescription = message.helpDescription.replace("%client.config.prefix%", client.config.prefix);

            const embed = new Discord.MessageEmbed()
                .setTitle(message.helpTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["logo"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .setDescription(message.helpDescription)
                .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
            interaction.reply({ embeds: [embed] });
        /*}*/
    }
};
