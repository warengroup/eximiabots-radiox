const fs = require('fs');
const path = require('path')

module.exports = {
    name: 'reload',
    alias: 'none',
    usage: '',
    description: 'Reload all files',
    onlyDev: true,
    permission: 'none',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        const commandFiles = fs.readdirSync(path.join(path.dirname(__dirname), 'commands')).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            command.uses = 0;
            client.commands.set(command.name, command);
            client.commandAliases.set(command.alias, command);
        }
        const settingFiles = fs.readdirSync(path.join(path.dirname(__dirname), 'commands/settings')).filter(f => f.endsWith('.js'));
        for (const file of settingFiles) {
            const option = require(`./settings/${file}`);
            client.settingCmd.set(option.name, option);
        }
        /*fs.readdirSync(path.join(__dirname, 'funcs')).forEach(filename => {
            this.funcs[filename.slice(0, -3)] = require(`../struct/funcs/${filename}`);
        });*/
        msg.channel.send('All files reloaded!');
    }
};
