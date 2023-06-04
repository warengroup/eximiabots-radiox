import RadioClient from "../../Client";

export default {
    name: 'SIGTERM',
    execute(client: RadioClient) {
        process.emit('SIGINT');
    }
}
