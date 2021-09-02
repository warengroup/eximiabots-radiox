import Discord from "discord.js";
module.exports = {
    name: 'messageCreate',
    async execute(client, msg) {

        if (msg.author.bot || !msg.guild) return;
        let prefix = "rx$";
        if(client.user.username == "RadioX"){
            prefix = "rx>";
        } else if (client.user.username == "RadioX Beta"){
            prefix = "rx-";
        } else if (client.user.username == "RadioX Dev"){
            prefix = "rx$";
        } else if(msg.mentions.members.first() && msg.mentions.members.first().user.id === client.user.id){
            prefix = "<@!" + client.user.id + "> ";
        } else {
            return;
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


        } catch (error) {
            msg.reply(client.messages.runningCommandFailed);
            console.error(error);
        }
    }
}