export default {
    name: 'uncaughtException',
    execute(client, error) {
        client.funcs.logger("Error");
        console.log(error.stack);
        console.log('');

        if(error.name == "DiscordAPIError" && error.message == "Unknown interaction") return;
        process.emit('SIGINT');
    }
}
