var dbconn = require('./Database/dbconn');

module.exports.addTwitter = function(req, res) {
    dbconn.addTwitter(req.body.socialContractId, req.body.authToken, req.body.authSecret,
        req.body.username, req.body.twitterId,  function(result) {
        res.send(result);
    });
}

module.exports.deleteTwitter = function(req, res) {
    dbconn.deleteTwitter(req.body.socialContractId, req.body.twitterId,  function(result) {
        res.send(result);
    });
}

module.exports.getTwitterAccounts = function(req, res) {
    dbconn.getTwitterAccounts(req.body.socialContractId, function(result) {
        res.send(result);
    });
}

module.exports.addFacebook = function(req, res) {
    dbconn.addFacebook(req.body.socialContractId, req.body.accessToken, req.body.facebookId, req.body.applicationId,
        function(result) {
        res.send(result);
    });
}

module.exports.deleteFacebook = function(req, res) {
    dbconn.deleteFacebook(req.body.socialContractId, req.body.facebookId, function(result) {
        res.send(result);
    });
}

module.exports.getFacebookAccounts = function(req, res) {
    dbconn.getFacebookAccounts(req.body.socialContractId, function(result) {
        console.log(req.body);
        console.log(res);
        res.send(result);
    });
}

module.exports.addInstagram = function(req, res) {
    dbconn.addInstagram(req.body.socialContractId, req.body.accessToken, req.body.instagramId,
        req.body.username, function(result) {
        res.send(result);
    });
}

module.exports.deleteInstagram = function(req, res) {
    dbconn.deleteInstagram(req.body.socialContractId, req.body.instagramId, function(result) {
        res.send(result);
    });
}

module.exports.getInstagramAccounts = function(req, res) {
    dbconn.getInstagramAccounts(req.body.socialContractId, function(result) {
        res.send(result);
    });
}
