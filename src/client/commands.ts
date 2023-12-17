import { ApplicationCommand, ApplicationCommandManager, BaseGuild, Guild, GuildApplicationCommandManager, OAuth2Guild, Snowflake } from "discord.js";
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
    const commands1 : command[] = [ help, invite, list, maintenance, next, play, prev, statistics, status, stop ];
    const commands2 = await client.application?.commands.fetch();

    for(const command of commands1){
        client.commands.set(command.name, command);
    }

    client.funcs.logger('Application Commands', 'Started refreshing application (/) commands.');
    if(commands1){
        for(const command of commands1){
            await client.application?.commands.create({
                name: command.name,
                description: command.description,
                options: command.options || []
            });
        }
    }

    if(commands2){
        commands2.forEach(async command2 => {
            if(commands1.findIndex((command1) => command1.name == command2.name) == -1){
                await client.application?.commands.delete(command2.id);
            }
        });
    }

    let guilds = await client.guilds.fetch();
        guilds.forEach(async (guild: Guild | OAuth2Guild) => {
            try {
                if(!client.application) return;
                await client.application.commands.set([], guild.id);
            } catch (DiscordAPIError){
            }
        });

    client.funcs.logger('Application Commands', 'Successfully reloaded application (/) commands.' + "\n");
}
