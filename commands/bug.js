module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, prefix) {
        
        let developers = "";
        let user = "";
        for(i = 0; i < client.config.devId.length; i++){
            user = await client.users.fetch(client.config.devId[i]);
            if(i == client.config.devId.length-1){
                developers += user.tag;
            } else {
                developers += user.tag + " & ";
            }
        }
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Found a bug with ${client.user.username}?\nDM the core developer:`)
            .setDescription(`${developers}\nOr join the support server: ${client.config.supportGuild}`)
            .setColor(client.config.embedColor);
        msg.channel.send(embed);
    },
};