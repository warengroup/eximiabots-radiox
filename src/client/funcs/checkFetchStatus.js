module.exports = function (response) {
    if (response.ok) { // res.status >= 200 && res.status < 300
        return response;
    } else {
        throw new Error(response.status + " " + response.statusText);
    }
}