import RadioClient from "../../Client";

export default function uncaughtException(client: RadioClient, error: Error) {
    client.funcs.logger("Error");
    console.log(error.stack);
    console.log('');

    console.log(error.name + "/" + error.message);
    if(error.name == "DiscordAPIError" && error.message == "Unknown interaction") return;
    process.emit('SIGINT');
}
