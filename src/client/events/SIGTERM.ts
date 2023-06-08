import RadioClient from "../../Client";

export default function SIGTERM(client: RadioClient) {
    process.emit('SIGINT');
}
