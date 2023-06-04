import RadioClient from "../../Client";

export default {
    name: 'uncaughtException',
    execute(client: RadioClient, error: any) {
        client.funcs.logger("Error");
        console.log(error.stack);
        console.log('');

        if(error.name == "DiscordAPIError" && error.message == "Unknown interaction") return;
        process.emit('SIGINT');
    }
}
