const mysql = require('mysql2')

var dbcredentials = require('./dbcredentials');

// for any database query, be sure to protect against sql injection by escaping all user entry
// this means that you put a ? instead of concatenating the strings
// then you put in the data that needs to be placed there in an array after "sql" in the query args

// gets user's password
var login = function(email, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT password FROM Users WHERE email = ?;";
    console.log('dbconn reached');
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        callback(result[0].password);
        conn.close();
    });
};

// adds new user to database
var register = function(email, password, salt, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO Users VALUES (0, ?, ?, ?, 10, 0);";
    conn.query(sql, [email, password, salt], function(err, result, fields) {
        callback(err);
        conn.close();
    });
}

// returns the userId if the user exists
var checkUser = function(email, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT userId FROM Users WHERE email = ?;";
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            callback({"success": true, "userId" : result[0].userId});
        } else {
            callback({"success": false});
        }
        conn.close();
    });
}

// gets the user's salt
var getSalt = function(email, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT salt FROM Users WHERE email = ?;";
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        callback(result[0].salt);
        conn.close();
    });
}

// changes the user's email
var editEmail = function(email, userId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "UPDATE Users SET email = ? WHERE userId = ?;";
    var query = conn.query(sql, [email, userId], function(err, result, fields) {
        if (err) throw err;
        if(result.affectedRows > 0) {
            callback(true);
        } else {
            callback(false);
        }
        conn.close();
    });
}

// changes the user's password
var editPassword = function(password, userId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "UPDATE Users SET password = ? WHERE userId = ?;";
    var query = conn.query(sql, [password, userId], function(err, result, fields) {
        if (err) throw err;
        if(result.affectedRows > 0) {
            callback(true);
        } else {
            callback(false);
        }
        conn.close();
    });
}

// gets the user's interest profile
var getInterest = function(userId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT interest FROM Users WHERE userId = ?;";
    var query = conn.query(sql, [userId], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            callback({'success': true, 'interest' : result[0].interest})
        } else {
            callback({'success': false});
        }
        conn.close();
    });
}

// edits the user's interest profile
var editInterest = function(userId, interest, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "UPDATE Users SET interest = ? WHERE userId = ?;";
    var query = conn.query(sql, [interest, userId], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success' : false});
        }
        conn.close();
    });
}

// inserts a Twitter account into the database
var addTwitter = function(socialContractId, authToken, authSecret, username, twitterId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO TwitterAccounts VALUE(?, ?, ?, ?, ?);";
    var query = conn.query(sql, [socialContractId, authToken, authSecret, username, twitterId], function(err, result, fields) {
        if (err) {
            if (err.code == 1062) {
                callback({'success' : false, 'message': 'This Twitter account has already been connected'});
            } else if (err.code == 1452) {
               callback({'success' : false, 'message': 'User ID does not match'});
            }
        } else if (result.affectedRows > 0) {
            callback({'success': true})
        } else {
            callback({'success': false, 'message': 'An unexpected error has occured'});
        }
        conn.close();
    });
}

// deletes a Twitter account from the database
var deleteTwitter = function(socialContractId, authToken, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM TwitterAccounts WHERE socialContractId = ? AND authToken = ?;";
    var query = conn.query(sql, [socialContractId, authToken], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success': false, 'message': 'Twitter account does not exist'});
        }
        conn.close();
    });
}

// adds a Facebook account into the database
var addFacebook = function(socialContractId, accessToken, facebookId, applicationId) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO FBAccounts VALUE(?, ?, ?, ?);";
    var query = conn.query(sql, [socialContractId, accessToken, facebookId, applicationId], function(err, result, fields) {
        if (err) {
            if (err.code == 1062) {
                callback({'success' : false, 'message': 'This Facebook account has already been connected'});
            } else if (err.code == 1452) {
               callback({'success' : false, 'message': 'User ID does not match'});
            }
        } else if (result.affectedRows > 0) {
            callback({'success': true})
        } else {
            callback({'success': false, 'message': 'An unexpected error has occured'});
        }
        conn.close();
    });
}

// deletes a Facebook account from the database
var deleteFacebook = function(socialContractId, accessToken, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM FBAccounts WHERE socialContractId = ? AND accessToken = ?;";
    var query = conn.query(sql, [socialContractId, accessToken], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success': false, 'message': 'Facebook account does not exist'});
        }
        conn.close();
    });
}

// adds an Instagram account into the database
var addInstagram = function(socialContractId, accessToken, instagramId, username) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO InstagramAccounts VALUE(?, ?, ?, ?);";
    var query = conn.query(sql, [socialContractId, accessToken, instagramId, username], function(err, result, fields) {
        if (err) {
            if (err.code == 1062) {
                callback({'success' : false, 'message': 'This Instagram account has already been connected'});
            } else if (err.code == 1452) {
               callback({'success' : false, 'message': 'User ID does not match'});
            }
        } else if (result.affectedRows > 0) {
            callback({'success': true})
        } else {
            callback({'success': false, 'message': 'An unexpected error has occured'});
        }
        conn.close();
    });
}

// deletes a Instagram account from the database
var deleteInstagram = function(socialContractId, accessToken, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM InstagramAccounts WHERE socialContractId = ? AND accessToken = ?;";
    var query = conn.query(sql, [socialContractId, accessToken], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success': false, 'message': 'Instagram account does not exist'});
        }
        conn.close();
    });
}

module.exports.login = login;
module.exports.register = register;
module.exports.checkUser = checkUser;
module.exports.getSalt = getSalt;
module.exports.editPassword = editPassword;
module.exports.editEmail = editEmail;
module.exports.editInterest = editInterest;
module.exports.getInterest = getInterest;
module.exports.addTwitter = addTwitter;
module.exports.deleteTwitter = deleteTwitter;
module.exports.addFacebook = addFacebook;
module.exports.deleteFacebook = deleteFacebook;
module.exports.addInstagram = addInstagram;
module.exports.deleteInstagram = deleteInstagram;
