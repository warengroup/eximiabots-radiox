module.exports = function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)));

    return +days > 0
        ? `${days}:${+hours < 10 ? `0${hours}` : hours}:${+minutes < 10 ? `0${minutes}` : minutes}:${+seconds < 10 ? `0${seconds}` : seconds}`
        : +hours > 0
            ? `${+hours < 10 ? `0${hours}` : hours}:${+minutes < 10 ? `0${minutes}` : minutes}:${+seconds < 10 ? `0${seconds}` : seconds}`
            : `${+minutes < 10 ? `0${minutes}` : minutes}:${+seconds < 10 ? `0${seconds}` : seconds}`;
}
