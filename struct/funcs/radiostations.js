module.exports = async function () {

    const fetch = require('node-fetch');

    let data = fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
                .then(res => res.json());

    return data;
}