import RadioClient from "../../Client";

export default {
    name: 'warning',
    execute(client: RadioClient, warning: Error) {
        if(warning.name == "ExperimentalWarning" && warning.message.startsWith("stream/web")) return;

        client.funcs.logger("Warning");
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
        console.log('');
    }
}
