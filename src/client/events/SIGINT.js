module.exports = {
    name: 'SIGINT',
    execute(client) {
        client.user.setStatus('dnd');

        client.streamer.stop(client);
        client.funcs.saveRadios(client);

        setInterval(() => {
            if(client.radio.size == 0){
                process.exit();
            }
        }, 500);
    }
}
