export default {
    name: 'SIGTERM',
    execute(client: any) {
        process.emit('SIGINT');
    }
}
