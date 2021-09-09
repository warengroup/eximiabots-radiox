module.exports = {
    name: 'uncaughtException',
    execute(client, error) {
        client.funcs.logger("Error");
        console.log(error.stack);
        console.log('');

        process.emit('SIGINT');
    }
}
