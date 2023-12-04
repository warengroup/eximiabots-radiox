import { Snowflake } from "discord.js";
import RadioClient from "../Client";
import help from "./commands/help";
import invite from "./commands/invite";
import list from "./commands/list";
import maintenance from "./commands/maintenance";
import next from "./commands/next";
import play from "./commands/play";
import prev from "./commands/prev";
import statistics from "./commands/statistics";
import status from "./commands/status";
import stop from "./commands/stop";

export interface command {
    name: string,
    description: string,
    category: string,
    options?: [],
    execute: Function
}

export default async function commands(client: RadioClient) {
    const commands : command[] = [ help, invite, list, maintenance, next, play, prev, statistics, status, stop ];

    for(const command of commands){
        client.commands.set(command.name, command);
    }

    if(!client.application) return;
    client.funcs.logger('Application Commands', 'Started refreshing application (/) commands.');
    if(client.config.devMode){
        client.application.commands.set([]);
        for(const command of commands){
            let guilds = await client.guilds.fetch();
            guilds.forEach(async (guild: { id: Snowflake; name: string; }) => {
                try {
                    if(!client.application) return;
                    await client.application.commands.create({
                        name: command.name,
                        description: command.description,
                        options: command.options || []
                    }, guild.id);
                    client.funcs.logger('Application Commands', 'Guild: ' + guild.id + " (" + guild.name + ") \n" + 'Command: ' + command.name);
                } catch(DiscordAPIError) {
                    client.funcs.logger('Application Commands', 'Guild: ' + guild.id + " (" + guild.name + ") [FAILED] \n" + 'Command: ' + command.name);
                }
            });
        }
    } else {
        for(const command of commands){
            await client.application.commands.create({
                name: command.name,
                description: command.description,
                options: command.options || []
            });

            client.funcs.logger('Application Commands', 'Command: ' + command.name);
        }

        let guilds = await client.guilds.fetch();
        guilds.forEach(async (guild: { id: Snowflake; }) => {
            try {
                if(!client.application) return;
                await client.application.commands.set([], guild.id);
            } catch (DiscordAPIError){
            }
        });
    }
    client.funcs.logger('Application Commands', 'Successfully reloaded application (/) commands.' + "\n");
}
