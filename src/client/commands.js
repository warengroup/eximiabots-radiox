const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, version } = require('../config.js');
const fs = require('fs');
const path = require ('path');

module.exports = {
    async execute(client) {
        const commands = [];
        const commandFiles = fs.readdirSync(path.join("./src/client/commands")).filter(f => f.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            command.data = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description);
            
            command.data = command.data.toJSON();
            if(command.options) {
                command.options.forEach(function(option) {
                    if(option.type == "STRING") option.type = 3;
                    command.data.options.push(option);
                });
            }

            commands.push(command.data);
        }

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                client.funcs.logger('Slash Commands', 'Started refreshing application (/) commands.');

                if(version.includes("-dev")){
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        { body: [] },
                    );

                    let guilds = await client.guilds.fetch();
                    guilds.forEach(async guild => {
                        try {
                            await rest.put(
                                Routes.applicationGuildCommands(client.user.id, guild.id),
                                { body: commands },
                            );
                        } catch (DiscordAPIError) {

                        }
                    });
                } else {
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        { body: commands },
                    );
                }

                client.funcs.logger('Slash Commands', 'Successfully reloaded application (/) commands.' + "\n");
            } catch (error) {
                client.funcs.logger('Slash Commands', 'Reloading application (/) commands failed.' + "\n");
                console.error(error);
            }
        })();
    }
}