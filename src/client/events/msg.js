module.exports = {
    name: 'message',
    async execute(client, msg, Discord) {
        if (msg.author.bot || !msg.guild) return;
        let prefix = client.config.prefix;
        if(msg.mentions.members.first()){
            if(msg.mentions.members.first().user.id === client.user.id){
                prefix = "<@!" + client.user.id + "> ";
            }
        }
        const args = msg.content.slice(prefix.length).split(' ');
        if (!msg.content.startsWith(prefix)) return;
        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        if (commandName === 'none') return;
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && msg.content !== `${prefix}`) return;
        const permissions = msg.channel.permissionsFor(msg.client.user);
        if (!permissions.has('EMBED_LINKS')) return msg.channel.send(client.messages.noPermsEmbed);
        try {
            command.execute(msg, args, client, Discord, command);
        } catch (error) {
            msg.reply(client.messages.runningCommandFailed);
            console.error(error);
        }
    }
}
