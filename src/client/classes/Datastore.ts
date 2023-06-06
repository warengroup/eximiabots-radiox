import { Guild } from 'discord.js';
import fs, { NoParamCallback } from 'fs';
import path from 'path';

interface entry {
    guild: {
        id: string,
        name?: string
    },
    statistics: {
        [key: string]: {
            "time": number,
            "used": number
        }
    } | {},
    state: {
        channels: {
            "text": string,
            "voice": string
        },
        date: string,
        station: {
            name: string,
            owner: string
        }
    } | {},
    updated?: string
}

export default class {
    map: Map<string, any>;
    constructor() {
        this.map = new Map();
        this.loadData();
    }

    loadData() {
        const dir = path.join(path.dirname(__dirname), '../../datastore');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        //console.log("");
        const dataFiles = fs.readdirSync(path.join(path.dirname(__dirname), '../../datastore')).filter((f: string) => f.endsWith('.json'));
        for (const file of dataFiles) {
            try {
                const json = require(`../../../datastore/${file}`);
                this.map.set(json.guild.id, json);
                //console.log('[LOADED] ' + file + " (" + json.guild.id + ")");
                //console.log(JSON.stringify(json, null, 4));
            } catch (error) {
                //console.log('[ERROR] Loading ' + file + ' failed');
            }
        }
        //console.log("");
    }

    checkEntry(id: string | undefined){
        if(!id) return;
        this.loadEntry(id);
        if(!this.map.has(id)){
            this.createEntry(id);
            //this.showEntry(this.getEntry(id));
        } else {
            //this.showEntry(this.getEntry(id));
        }
    }

    createEntry(id: string){
        let newData: entry = {
            guild: {
                id: id,
            },
            statistics: {},
            state: {}
        };
        this.map.set(id, newData);
        this.saveEntry(id, newData);
    }

    loadEntry(id: string){
        try {
            const json = require(`../../../datastore/` + id + '.json');
            this.map.set(id, json);
        } catch (error) {
        }
    }

    getEntry(id: string){
        return this.map.get(id);
    }

    updateEntry(guild: Guild | { id: string, name: string }, newData: entry) {
        newData.guild.name = guild.name;

        let date = new Date();
        newData.updated = date.toISOString().substring(0, 10)

        this.map.set(guild.id, newData);
        this.saveEntry(guild.id, newData);
        //this.showEntry(this.getEntry(guild.id));
    }

    showEntry(data : entry){
        console.log(data);
    }

    createTestFile () {
        let newData = {
            "guild": {
                "id": "test",
                "name": "Test"
            },
            "statistics": {
                "test": {
                    "time": 0,
                    "used": 0
                }
            },
            "state": {

            }
        }

        this.updateEntry(newData.guild, newData);
    }

    saveEntry(file: string, data: entry) {
        fs.writeFile(path.join(path.dirname(__dirname), '../../datastore') + "/" + file + ".json", JSON.stringify(data, null, 4), 'utf8', function(err: any) {
            if (err) {

            }
        });
    }
};
