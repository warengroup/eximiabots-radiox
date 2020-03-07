module.exports = function (msg, args, client, Discord, prefix, command) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('EMBED_LINKS')) return msg.channel.send('<:redx:674263474704220182> I cannot send embeds (Embed links), make sure I have the proper permissions!');
    try {
        command.uses++;
        command.execute(msg, args, client, Discord, prefix, command);
    } catch (error) {
        msg.reply(`<:redx:674263474704220182> there was an error trying to execute that command! Please contact support with \`${prefix}bug\`!`);
        const embed = new Discord.MessageEmbed()
            .setTitle(`Musix ${error.toString()}`)
            .setDescription(error.stack.replace(/at /g, '**at **'))
            .setColor('#b50002');
        client.debug_channel.send(embed);
        console.error(error);
    }
};
