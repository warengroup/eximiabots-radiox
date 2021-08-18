const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.js');
const fs = require('fs');
const path = require ('path');

module.exports = {
    async execute(clientId) {
        const commands = [];
        const commandFiles = fs.readdirSync(path.join("./src/client/commands")).filter(f => f.endsWith(".js"));

        // Place your client and guild ids here
        const guildId = '530811780893507596';

        for (const file of commandFiles) {
	        const command = require(`./commands/${file}`);
	        commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
	        try {
		        console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);				
		        await rest.put(
			        Routes.applicationGuildCommands(clientId, guildId),
			        { body: commands },
		        );

		        console.log('Successfully reloaded application (/) commands.');
	        } catch (error) {
		        console.error(error);
	        }
        })();
    }
}