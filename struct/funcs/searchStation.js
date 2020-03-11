module.exports = function (key, client) {
    if (client.stations === null) return false;
    let foundStations = [];
    if (!key) return false;
    if (key == 'radio') return false;
    if (key.startsWith("radio ")) key = key.slice(6);
    const probabilityIncrement = 100 / key.split(' ').length / 2;
    for (let i = 0; i < key.split(' ').length; i++) {
        client.stations.filter(x => x.name.toUpperCase().includes(key.split(' ')[i].toUpperCase()) || x === key).forEach(x => foundStations.push({ station: x, name: x.name, probability: probabilityIncrement }));
    }
    if (foundStations.length === 0) return false;
    for (let i = 0; i < foundStations.length; i++) {
        for (let j = 0; j < foundStations.length; j++) {
            if (foundStations[i] === foundStations[j] && i !== j) foundStations.splice(i, 1);
        }
    }
    for (let i = 0; i < foundStations.length; i++) {
        if (foundStations[i].name.length > key.length) {
            foundStations[i].probability -= (foundStations[i].name.split(' ').length - key.split(' ').length) * (probabilityIncrement * 0.5);
        } else if (foundStations[i].name.length === key.length) {
            foundStations[i].probability += (probabilityIncrement * 0.9);
        }

        for (let j = 0; j < key.split(' ').length; j++) {
            if (!foundStations[i].name.toUpperCase().includes(key.toUpperCase().split(' ')[j])) {
                foundStations[i].probability -= (probabilityIncrement * 0.5);
            }
        }
    }
    let highestProbabilityStation;
    for (let i = 0; i < foundStations.length; i++) {
        if (!highestProbabilityStation || highestProbabilityStation.probability < foundStations[i].probability) highestProbabilityStation = foundStations[i];
        if (highestProbabilityStation && highestProbabilityStation.probability === foundStations[i].probability) {
            highestProbabilityStation = foundStations[i].station;
        }
    }
    return highestProbabilityStation;
};