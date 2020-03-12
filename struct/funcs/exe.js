module.exports = function (msg, args, client, Discord, prefix, command) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('EMBED_LINKS')) return msg.channel.send('I cannot send embeds (Embed links).');
    try {
        command.uses++;
        command.execute(msg, args, client, Discord, prefix, command);
    } catch (error) {
        msg.reply(`Error!`);
        console.error(error);
    }
};
