const _importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = (...args) => _importDynamic('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = class Stations extends Array {
    constructor() {
        super();
        this.logger = require("../funcs/logger.js");
    }

    async fetch(options){
        try {
            this.logger('Stations', 'Started fetching list – ' + options.url);
            let list = await fetch(options.url)
                .then(this.checkFetchStatus)
                .then(response => response.json());

            if(list){
                this.length = 0;
                list.forEach(station => {
                    this.push(station);
                });

                if(options.show){
                    this.logger('Stations');
                    list.forEach(station => {
                        console.log("- " + station.name);
                    });
                    console.log("\n");
                }
            }

            this.logger('Stations', 'Successfully fetched list');
        } catch (error) {
            this.logger('Stations', 'Fetching list failed');
            console.error(error + "\n");

            this.fetch(options);
        }
    }

    checkFetchStatus(response) {
        if (response.ok) { // res.status >= 200 && res.status < 300
            return response;
        } else {
            throw new Error(response.status + " " + response.statusText);
        }
    }

    search(key) {
        if (this === null) return false;
        let foundStations = [];
        if (!key) return false;
        if (key == "radio") return false;

        this
            .filter(
                x => x.name.toUpperCase().includes(key.toUpperCase()) || x === key
            )
            .forEach(x =>
                foundStations.push({ station: x, name: x.name, probability: 100 })
            );

        if (key.startsWith("radio ")) key = key.slice(6);
        const probabilityIncrement = 100 / key.split(" ").length / 2;
        for (let i = 0; i < key.split(" ").length; i++) {
            this
                .filter(
                    x => x.name.toUpperCase().includes(key.split(" ")[i].toUpperCase()) || x === key
                )
                .forEach(x =>
                    foundStations.push({ station: x, name: x.name, probability: probabilityIncrement })
                );
        }
        if (foundStations.length === 0) return false;
        for (let i = 0; i < foundStations.length; i++) {
            for (let j = 0; j < foundStations.length; j++) {
                if (foundStations[i] === foundStations[j] && i !== j) foundStations.splice(i, 1);
            }
        }
        for (let i = 0; i < foundStations.length; i++) {
            if (foundStations[i].name.length > key.length) {
                foundStations[i].probability -=
                    (foundStations[i].name.split(" ").length - key.split(" ").length) *
                    (probabilityIncrement * 0.5);
            } else if (foundStations[i].name.length === key.length) {
                foundStations[i].probability += probabilityIncrement * 0.9;
            }

            for (let j = 0; j < key.split(" ").length; j++) {
                if (!foundStations[i].name.toUpperCase().includes(key.toUpperCase().split(" ")[j])) {
                    foundStations[i].probability -= probabilityIncrement * 0.5;
                }
            }
        }
        let highestProbabilityStation;
        for (let i = 0; i < foundStations.length; i++) {
            if (
                !highestProbabilityStation ||
                highestProbabilityStation.probability < foundStations[i].probability
            )
                highestProbabilityStation = foundStations[i];
            if (
                highestProbabilityStation &&
                highestProbabilityStation.probability === foundStations[i].probability
            ) {
                highestProbabilityStation = foundStations[i].station;
            }
        }
        return highestProbabilityStation;
    }
};