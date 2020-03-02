module.exports = {
    name: 'message',
    async execute(client, msg, Discord) {
        if (msg.author.bot || !msg.guild) return;
        let prefix = client.config.prefix
        if (client.config.devMode) prefix = client.config.devPrefix;
        const args = msg.content.slice(prefix.length).split(' ');
        if (msg.mentions.users.first()) {
            if (msg.mentions.users.first().id === client.user.id) {
                if (!args[1]) return;
                if (args[1] === 'prefix') return msg.channel.send(`My prefix here is: \`${prefix}\`.`);
                if (args[1] === 'help') {
                    const command = client.commands.get("help");
                    return client.funcs.exe(msg, args, client, Discord, prefix, command);
                }
            }
        }
        if (!msg.content.startsWith(prefix)) return;
        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && msg.content !== `${prefix}`) return;
        if (command.onlyDev && msg.author.id !== client.config.devId) return msg.channel.send('<:redx:674263474704220182> You are not allowed to do that!');
        if (client.config.devMode && msg.member.id !== client.config.devId) return msg.channel.send('<:redx:674263474704220182> Dev mode has been turned on! Commands are only available to developer(s)!');
        client.funcs.exe(msg, args, client, Discord, prefix, command);
    }
}
