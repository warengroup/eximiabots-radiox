const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, version } = require('../../config.js');

module.exports = {
    name: 'SIGINT',
    async execute(client) {
        client.user.setStatus('dnd');

        console.log("\n");
        client.funcs.logger("Bot", "Closing");
        console.log("\n");
        
        setTimeout(async function () {
            let message = {};

            if (!client.stations) return process.exit();

            await client.funcs.saveRadios(client);
            await process.exit();
        }, 5000);
    }
}