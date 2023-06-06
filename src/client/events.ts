import RadioClient from "../Client"
import interactionCreate from "./events/interactionCreate"
import messageDelete from "./events/messageDelete"
import ready from "./events/ready"
import SIGINT from "./events/SIGINT"
import SIGTERM from "./events/SIGTERM"
import uncaughtException from "./events/uncaughtException"
import voiceStateUpdate from "./events/voiceStateUpdate"
import warning from "./events/warning"

export default function events(client: RadioClient) {
    client.on("ready", () => {
        ready(client);
    });

    client.on("messageDelete", msg => {
        messageDelete(client, msg);
    });

    client.on("interactionCreate", interaction => {
        interactionCreate(client, interaction);
    });

    client.on("voiceStateUpdate", (oldState, newState) => {
        voiceStateUpdate(client, oldState, newState);
    });

    client.on("error", error => {
        client.funcs.logger("Discord Client", "Error");
        console.error(error);
        console.log('');
    });

    process.on('SIGINT', () => {
        SIGINT(client);
    });

    process.on('SIGTERM', () => {
        SIGTERM(client);
    });

    process.on('uncaughtException', (error) => {
        uncaughtException(client, error);
    });

    process.on('exit', () => {
        client.funcs.logger("Bot", "Stopping");
    });

    process.on('warning', (error) => {
        warning(client, error);
    });
}
