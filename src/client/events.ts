import interactionCreate from "./events/interactionCreate"
import messageDelete from "./events/messageDelete"
import ready from "./events/ready"
import SIGINT from "./events/SIGINT"
import SIGTERM from "./events/SIGTERM"
import uncaughtException from "./events/uncaughtException"
import voiceStateUpdate from "./events/voiceStateUpdate"
import warning from "./events/warning"

export default {
    interactionCreate, messageDelete, ready, SIGINT, SIGTERM, uncaughtException, voiceStateUpdate, warning
}
