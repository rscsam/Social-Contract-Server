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

module.exports.login = login;
module.exports.logininit = logininit;
module.exports.initregistration = initregistration;
module.exports.register = register;