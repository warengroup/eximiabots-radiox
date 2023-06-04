const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require ('path');

export default {
    async execute(client) {

        const commands = [];
        const commandFiles = fs.readdirSync(path.join("./src/client/commands")).filter(f => f.endsWith(".ts"));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);

            command.data = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description);

            command.data = command.data.toJSON();
            if(command.options) {
                command.options.forEach(function(option) {
                    if(option.type == "STRING") option.type = 3;
                    if(option.type == "NUMBER") option.type = 10;
                    command.data.options.push(option);
                });
            }

            commands.push(command.data);
        }

        const rest = new REST({ version: '9' }).setToken(client.config.token);

        (async () => {
            try {
                client.funcs.logger('Slash Commands', 'Started refreshing application (/) commands.');

                if(client.config.devMode){
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        { body: [] },
                    );

                    let guilds = await client.guilds.fetch();
                    guilds.forEach(async guild => {
                        try {
                            await rest.put(
                                Routes.applicationGuildCommands(client.user.id, guild.id),
                                { body: commands }
                            );
                            client.funcs.logger('Slash Commands', 'Guild Applications – Successful' + "\n" + guild.id + " / " + guild.name);
                        } catch (DiscordAPIError) {
                            client.funcs.logger('Slash Commands', 'Guild Applications – Failed' + "\n" + guild.id + " / " + guild.name);
                            if(DiscordAPIError.name != "DiscordAPIError[50001]") console.error(DiscordAPIError.message + "\n\n");
                        }
                    });
                } else {
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        { body: commands }
                    );

                    let guilds = await client.guilds.fetch();
                    guilds.forEach(async guild => {
                        try {
                            await rest.put(
                                Routes.applicationGuildCommands(client.user.id, guild.id),
                                { body: [] }
                            );
                        } catch (DiscordAPIError) {
                        }
                    });
                }

                client.funcs.logger('Slash Commands', 'Successfully reloaded application (/) commands.' + "\n");
            } catch (error) {
                client.funcs.logger('Slash Commands', 'Reloading application (/) commands failed.' + "\n");
                console.error(error);
            }
        })();
    }
}
