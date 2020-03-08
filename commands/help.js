module.exports = {
    name: 'help',
    alias: 'h',
    usage: '<command(opt)>',
    description: 'See the help for RadioX.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix, command) {
        if (args[1]) {
            if (!client.commands.has(args[1]) || (client.commands.has(args[1]) && client.commands.get(args[1]).omitFromHelp === true)) return msg.channel.send('That command does not exist');
            const command = client.commands.get(args[1]);
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.global.db.guilds[msg.guild.id].prefix}${command.name} ${command.usage}`)
                .setColor(client.config.embedColor)
                .setDescription(command.description + `\n Command Alias: \`${command.alias}\``)
                .setFooter('EximiaBots by Warén Media')
            msg.channel.send(embed);
        } else {
            const categories = [];
            for (let i = 0; i < client.commands.size; i++) {
                if (!categories.includes(client.commands.array()[i].category)) categories.push(client.commands.array()[i].category);
            }
            let commands = '';
            for (let i = 0; i < categories.length; i++) {
                commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp).map(x => `\`${x.name}\``).join(', ')}\n`;
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} help:`)
                .setColor(client.config.embedColor)
                .setDescription(commands + `\n "${client.config.prefix}help <command>" to see more information about a command.`)
                .setFooter('EximiaBots by Warén Media');
            msg.channel.send(embed);
        }
    }
};
