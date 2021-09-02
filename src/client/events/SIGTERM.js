module.exports = {
    name: 'SIGTERM',
    async execute(client) {
        process.emit('SIGINT');
    }
}