const fs = require('fs');
const path = require('path');

module.exports = class {
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
        const dataFiles = fs.readdirSync(path.join(path.dirname(__dirname), '../../datastore')).filter(f => f.endsWith('.json'));
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

    checkEntry(id){
        this.loadEntry(id);
        if(!this.map.has(id)){
            this.createEntry(id);
            //this.showEntry(this.getEntry(id));
        } else {
            //this.showEntry(this.getEntry(id));
        }
    }

    createEntry(id){
        let newData = {};
        newData.guild = {};
        newData.guild.id = id;
        newData.statistics = {};
        newData.state = {};
        this.map.set(id, newData);
        this.saveEntry(id, newData);
    }

    loadEntry(id){
        try {
            const json = require(`../../../datastore/` + id + '.json');
            this.map.set(id, json);
        } catch (error) {
        }
    }

    getEntry(id){
        return this.map.get(id);
    }

    updateEntry(guild, newData) {
        newData.guild.name = guild.name;

        let date = new Date();
        newData.updated = date.toISOString().substring(0, 10)

        this.map.set(guild.id, newData);
        this.saveEntry(guild.id, newData);
        //this.showEntry(this.getEntry(guild.id));
    }

    showEntry(data){
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

    saveEntry(file, data) {
        data = JSON.stringify(data, null, 4);

        fs.writeFile(path.join(path.dirname(__dirname), '../../datastore') + "/" + file + ".json", data, 'utf8', function(err) {
            if (err) {
                //console.log(err);
            }
        });
    }
};
