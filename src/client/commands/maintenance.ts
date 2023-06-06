import { ActionRowBuilder, AnyComponentBuilder, APIActionRowComponent, APISelectMenuOption, ButtonInteraction, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import Streamer from "../classes/Streamer";
import commands from "../commands";
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
// @ts-ignore
const fetch = (...args) => _importDynamic('node-fetch').then(({default: fetch}) => fetch(...args));

export default {
    name: 'maintenance',
    description: 'Bot Maintenance',
    category: 'info',
    async execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {
        let message: any = {};

        if(!client.funcs.isDev(client.config.devId, interaction.user.id)) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.notAllowed,
            ephemeral: true
        });

        let action : number | string | null = null;

        if(interaction.isChatInputCommand()){
            action = interaction.options?.getNumber("action");
        }

        if(interaction.isStringSelectMenu()){
            action = interaction.values?.[0];
        }

        const options: APISelectMenuOption[] = new Array(
            {
                emoji: {
                    "name": "🌀",
                },
                label: "Restart Bot",
                value: "0"
            },
            {
                emoji: {
                    id: "688541155377414168",
                    name: "RadioXStop",
                },
                label: "Save Radios",
                value: "4"
            },
            {
                emoji: {
                    id: "688541155712827458",
                    name: "RadioXPlay",
                },
                label: "Restore Radios",
                value: "5"
            },
            {
                emoji: {
                    name: "#️⃣",
                },
                label: "Reload Commands",
                value: "6"
            },
            {
                emoji: {
                    id: "688541155519889482",
                    name: "RadioXList",
                },
                label: "Reload Stations",
                value: "7"
            },
            {
                emoji: {
                    id: "746069698139127831",
                    name: "dnd",
                },
                label: "Enable Maintenance Mode",
                value: "8"
            },
            {
                emoji: {
                    id: "746069731836035098",
                    name: "online",
                },
                label: "Disable Maintenance Mode",
                value: "9"
            },
            {
                emoji: {
                    name: "💤",
                },
                label: "Streamer Mode - Manual",
                value: "10"
            },
            {
                emoji: {
                    name: "📡",
                },
                label: "Streamer Mode - Auto",
                value: "11"
            }
        );

        const menu : ActionRowBuilder<any> = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('maintenance')
                    .setPlaceholder('Select action')
                    .addOptions(options)
            );

        if(!action){
            return interaction.reply({
                content: "**" + client.messages.maintenanceTitle + "**",
                components: [menu],
                ephemeral: true
            });
        }

        client.funcs.logger('Maintenance', options.find((option: APISelectMenuOption) => option.value == action)?.label);

        const embed = new EmbedBuilder()
            .setTitle(client.messages.maintenanceTitle)
            .setColor(client.config.embedColor as ColorResolvable)
            .setDescription(options.find((option: APISelectMenuOption) => option.value == action)?.label || "-")
            .setFooter({
                text: client.messages.footerText,
                iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
            });

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        let guilds = await client.guilds.fetch();

        switch(action){
            case "0":
                client.config.maintenanceMode = true;
                process.emit('SIGINT');
                break;
            case "4":
                client.config.maintenanceMode = true;
                client.user?.setStatus('idle');
                client.radio?.save(client);
                client.user?.setStatus('online');
                client.config.maintenanceMode = false;
                break;
            case "5":
                client.config.maintenanceMode = true;
                client.user?.setStatus('idle');
                client.radio?.restore(client, guilds);
                client.user?.setStatus('online');
                client.config.maintenanceMode = false;
                break;
            case "6":
                client.config.maintenanceMode = true;
                client.user?.setStatus('idle');
                commands(client);
                client.user?.setStatus('online');
                client.config.maintenanceMode = false;
                break;
            case "7":
                try {
                    client.stations?.fetch({
                        url: client.config.stationslistUrl
                    });
                    client.streamer?.refresh(client);

                } catch (error) {

                }
                break;
            case "8":
                client.user?.setStatus('dnd');
                client.funcs.logger("Maintenance Mode", "Enabled");
                client.config.maintenanceMode = true;
                break;
            case "9":
                client.user?.setStatus('online');
                client.funcs.logger("Maintenance Mode", "Disabled");
                client.config.maintenanceMode = false;
                break;
            case "10":
                client.config.streamerMode = "manual";
                client.config.maintenanceMode = true;

                client.user?.setStatus('idle');
                client.radio?.save(client);

                setInterval(() => {
                    if(client.radio?.size == 0 && client.config.streamerMode == "manual" && client.config.maintenanceMode){
                        client.streamer?.leave(client);
                        client.streamer = new Streamer();
                        client.streamer.init(client);

                        client.radio?.restore(client, guilds);
                        client.user?.setStatus('online');
                        client.config.maintenanceMode = false;
                    }

                    if(!client.config.maintenanceMode){
                        clearInterval(undefined);
                    }
                }, 500);

                break;
            case "11":
                client.config.streamerMode = "auto";
                client.config.maintenanceMode = true;

                client.user?.setStatus('idle');
                client.radio?.save(client);

                setInterval(() => {
                    if(client.radio?.size == 0 && client.config.streamerMode == "auto" && client.config.maintenanceMode){
                        client.streamer?.leave(client);
                        client.streamer = new Streamer();
                        client.streamer.init(client);

                        client.radio.restore(client, guilds);
                        client.user?.setStatus('online');
                        client.config.maintenanceMode = false;
                    }

                    if(!client.config.maintenanceMode){
                        clearInterval(undefined);
                    }
                }, 500);

                break;
            default:

        }

    }
};
