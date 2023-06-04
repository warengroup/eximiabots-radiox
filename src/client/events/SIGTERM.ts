export default {
    name: 'SIGTERM',
    execute(client) {
        process.emit('SIGINT');
    }
}
