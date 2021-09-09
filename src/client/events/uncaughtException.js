module.exports = {
    name: 'uncaughtException',
    execute(client, error) {
        this.funcs.logger("Error");
        console.log(error.stack);
        console.log('');

        process.emit('SIGINT');
    }
}
