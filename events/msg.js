module.exports = {
    name: 'message',
    async execute(client, msg, Discord) {
        if (msg.author.bot || !msg.guild) return;
        let prefix = client.config.prefix;
        const args = msg.content.slice(prefix.length).split(' ');
        if (!msg.content.startsWith(prefix)) return;
        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && msg.content !== `${prefix}`) return;
        const permissions = msg.channel.permissionsFor(msg.client.user);
        if (!permissions.has('EMBED_LINKS')) return msg.channel.send('I cannot send embeds (Embed links).');
        try {
            command.uses++;
            command.execute(msg, args, client, Discord, prefix, command);
        } catch (error) {
            msg.reply(`Error!`);
            console.error(error);
        }
    }
}
