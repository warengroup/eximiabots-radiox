import Discord from "discord.js";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, version } = require('../../config.js');

module.exports = {
    name: 'SIGINT',
    async execute(client) {
        setTimeout(async function () {
            let message = {};

            if (!client.stations) return process.exit();

            let currentRadios = client.radio.keys();
            let radio = currentRadios.next();

            while (!radio.done) {
                let currentRadio = client.radio.get(radio.value);
                currentRadio.guild = client.datastore.getEntry(radio.value).guild;

                if (currentRadio) {
                    await client.funcs.statisticsUpdate(client, currentRadio.guild, currentRadio);
                    await client.funcs.saveState(client, currentRadio.guild, currentRadio);
                    currentRadio.connection?.destroy();
                    currentRadio.audioPlayer?.stop();
                    currentRadio.message?.delete();
                    client.radio.delete(radio.value);
                }
                
                radio = currentRadios.next();
            }

            console.log("\n");
            client.funcs.logger("Bot", "Closing");
            console.log("\n");

            client.user.setStatus('dnd');

            const rest = new REST({ version: '9' }).setToken(token);
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
                            { body: [] },
                        );
                    } catch (DiscordAPIError) {

                    }
                });
            }

            setInterval(() => {
                if(radio.done){
                    process.exit();
                }
            }, 1000);
        }, 5000);
    }
}