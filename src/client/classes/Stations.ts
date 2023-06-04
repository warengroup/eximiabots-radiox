const _importDynamic = new Function('modulePath', 'return import(modulePath)');
// @ts-ignore
const fetch = (...args: any) => _importDynamic('node-fetch').then(({default: fetch}) => fetch(...args));
import logger from "../funcs/logger";

export default class Stations extends Array {
    logger: any;

    constructor() {
        super();
        this.logger = logger;
    }

    async fetch(options: any){
        try {
            this.logger('Stations', 'Started fetching list – ' + options.url);
            let list = await fetch(options.url)
                .then(this.checkFetchStatus)
                .then((response: { json: () => any; }) => response.json());

            if(list){
                this.length = 0;
                list.forEach((station: any) => {
                    try {
                        this.push(station);
                    } catch (error) {

                    }
                });

                if(options.show){
                    list.forEach((station: { name: any; }) => {
                        this.logger('Stations', station.name);
                    });
                }

                list.forEach(async (station: { stream: { [x: string]: any; default: string | number; }; }) => {
                    try {
                        let stationTest = await fetch(station.stream[station.stream.default]);
                        if(stationTest.ok === true) return;
                        this.splice(this.indexOf(station),1);
                    } catch (error) {
                        this.splice(this.indexOf(station),1);
                    }
                });
            }

            this.logger('Stations', 'Successfully fetched list');
        } catch (error) {
            this.logger('Stations', 'Fetching list failed');
            console.error(error + "\n");

            if(this.length == 0) this.fetch(options);
        }
    }

    checkFetchStatus(response: any) {
        if (response.ok) { // res.status >= 200 && res.status < 300
            return response;
        } else {
            throw new Error(response.status + " " + response.statusText);
        }
    }

    search(key: string, type: string) {
        if (this === null) return false;
        if (!key) return false;
        if (!type) return false;

        if(type == "direct"){
            let foundStation;
            this.forEach(station => {
                if(station.name != key) return false;
                foundStation = station;
            });

            return foundStation;
        } else {

            let foundStations : any[] = [];
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
    }
};
