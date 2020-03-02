module.exports = {
    name: 'eval',
    alias: 'e',
    usage: '<code>',
    description: 'Evaluation command. DEV ONLY!',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, prefix) {
        const radio = client.radio.get(msg.guild.id);
        const input = msg.content.slice(prefix.length + 4);
        let output;
        try {
            output = await eval(input);
        } catch (error) {
            output = error.toString();
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('Evaluation Command')
            .setColor(client.config.embedColor)
            .setDescription(`Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``);
        return msg.channel.send(embed);
    },
};
