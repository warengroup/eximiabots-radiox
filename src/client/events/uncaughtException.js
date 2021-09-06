module.exports = {
    name: 'uncaughtException',
    execute(client, error) {
        console.log(error.stack);
        process.emit('SIGINT');
    }
}