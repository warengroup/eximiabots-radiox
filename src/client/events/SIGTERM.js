module.exports = {
    name: 'SIGTERM',
    execute(client) {
        process.emit('SIGINT');
    }
}
