var dbconn = require('./Database/dbconn');
const crypto = require('crypto');

//holds a username and the current nonce
var nonceMap = new Map();

var login = function(req, res) {
    dbconn.login(req.body.email, function(result) {
        const hash = crypto.createHash('sha256');
        var dbPass = result + nonceMap.get(req.body.email)
        nonceMap.delete(req.body.email);
        hash.update(dbPass);
        dbPass = hash.digest('hex');

        if(dbPass == req.body.password) {
            res.send({'success': true});
        } else {
            res.send({'success': false, 'message' : 'Incorrect password'});
        }
    });
}

var logininit = function(req, res) {
    console.log('init reached')
    dbconn.checkUser(req.body.email, function(result) {
        if (result.success == true) {
            dbconn.getSalt(req.body.email, function(salt) {
                 crypto.randomBytes(16, (err, buff) => {
                    if (err) throw err;
                    nonceMap.set(req.body.email, buff.toString('hex'));
                    res.send({'nonce': buff.toString('hex'), 'salt': salt, 'success' : true, 'userId' : result.userId});
                });
            });
        } else {
            res.send({'message': 'User does not exist', 'success': false})
        }
    });
}

var initregistration = function(req, res) {
    dbconn.checkUser(req.body.email, function(result) {
        if (result.success == false) {
            crypto.randomBytes(32, (err, buff) => {
                if (err) throw err;
                res.send({"result": buff.toString('hex'), 'success' : true});
            });
        } else {
            res.send({"result" : "User already exists", 'success' : false});
        }
    });
}

var register = function(req, res) {
    console.log(req.body);
    dbconn.register(req.body.email, req.body.password, req.body.salt, function(err) {
        if(err) {
            res.send({'success' : false, 'message' : err});
        } else {
            dbconn.checkUser(req.body.email, function(result) {
                if (result.success) {
                    res.send({'success' : true, "userId" : result.userId});
                } else {
                    res.send({'success': false, 'message' : 'There was an unexpected error in registration.'});
                }
            });
        }
    });
}

module.exports.updateInterestProfile = function(req, res) {
    profileBitString = 0;
    if (req.body.music) profileBitString += 1;
    if (req.body.food) profileBitString += 2;
    if (req.body.movies) profileBitString += 4;
    if (req.body.videogames) profileBitString += 8;
    if (req.body.sports) profileBitString += 16;
    if (req.body.memes) profileBitString += 32;
    dbconn.editInterest(req.body.socialContractId, profileBitString, function(result) {
        res.send(result);
    });
}

module.exports.getInterestProfile = function(req, res) {
    dbconn.getInterest(req.body.socialContractId, function(result) {
        if (result.success) {
            num = result.interest;
            delete result.interest;
            result['music'] = (num & 1) == 1;
            result['food'] = (num & 2) == 2;
            result['movies'] = (num & 4) == 4;
            result['videogames'] = (num & 8) == 8;
            result['sports'] = (num & 16) == 16;
            result['memes'] = (num & 32) == 32;
        }
        res.send(result);
    });
}

var changeEmail = function(req, res) {
    console.log(req.body);
    if (req.body.email == null || req.body.email == "") {
        res.send({'success' : false, 'message' : "email is blank"});
    } else if (req.body.userId == null || req.body.userId == "") {
        res.send({'success' : false, 'message' : "userId is blank"});
    } else {
        dbconn.editEmail(req.body.email, req.body.userId, function(result) {
            if(!result) {
                res.send({'success' : false, 'message' : "error editing email"});
            } else {
                res.send({'success' : true});
            }
        });
    }
}

var changePassword = function(req, res) {
    console.log(req.body);
    if (req.body.password == null || req.body.password == "") {
        res.send({'success' : false, 'message' : "password is blank"});
    } else if (req.body.userId == null || req.body.userId == "") {
        res.send({'success' : false, 'message' : "userId is blank"});
    } else {
        dbconn.editPassword(req.body.password, req.body.userId, function(result) {
            if(!result) {
                res.send({'success' : false, 'message' : "error editing password"});
            } else {
                res.send({'success' : true});
            }
        });
    }
}

module.exports.login = login;
module.exports.logininit = logininit;
module.exports.initregistration = initregistration;
module.exports.register = register;
module.exports.changeEmail = changeEmail;
module.exports.changePassword = changePassword;
