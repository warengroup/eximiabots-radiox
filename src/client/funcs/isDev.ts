import { Snowflake } from "discord.js";

export default function isDev(devIDs : any[], authorID : Snowflake){
    let response = false;
    for (const devID of devIDs){
        if(authorID == devID){
            return true;
        }
    }
}
