import RadioClient from "../../Client";

export default function uncaughtException(client: RadioClient, error: Error) {
    client.funcs.logger("Error");
    console.log(error.stack);
    console.log('');

    if(error.name == "DiscordAPIError" && error.message == "Unknown interaction") return;
    process.emit('SIGINT');
}
