module.exports = {
    name: 'warning',
    execute(client, warning) {
        if(warning.name == "ExperimentalWarning" && warning.message.startsWith("stream/web")) return;

        client.funcs.logger("Warning");
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
        console.log('');
    }
}
