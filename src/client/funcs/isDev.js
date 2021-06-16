module.exports = function (devList, authorID){
    let response = false;
    Object.keys(devList).forEach(function(oneDev) {
        let devID = devList[oneDev];
        if(authorID == devID){
            response = true;
        }
    });
    return response;
}