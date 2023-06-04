module.exports = {
    name: 'SIGINT',
    execute(client) {
        client.user.setStatus('dnd');

        client.streamer.leave(client);
        client.radio.save(client);

        setInterval(() => {
            if(client.radio.size == 0){
                process.exit();
            }
        }, 500);
    }
}
