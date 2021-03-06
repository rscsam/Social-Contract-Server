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
        if (err) {
            callback({"success": false, "message": "Another user owns this email"});
        } else {
            if(result.affectedRows > 0) {
                callback({"success": true});
            } else {
                callback({"success": true, "message": "Error editing email"});
            }
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
            callback({'success': true, 'interest' : result[0].interest[result[0].interest.length - 1]})
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
    var query = conn.query(sql, [socialContractId, twitterId, authToken, authSecret, username], function(err, result, fields) {
        if (err) {
            if (err.code == 1062) {
                callback({'success' : false, 'message': 'This Twitter account has already been connected'});
            } else if (err.code == 1452) {
               callback({'success' : false, 'message': 'User ID does not match'});
            } else {
                callback({'success' : false, 'message': err.message})
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
var deleteTwitter = function(socialContractId, twitterId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM TwitterAccounts WHERE socialContractId = ? AND twitterId = ?;";
    var query = conn.query(sql, [socialContractId, twitterId], function(err, result, fields) {
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
var addFacebook = function(socialContractId, accessToken, facebookId, applicationId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO FBAccounts VALUE(?, ?, ?, ?);";
    var query = conn.query(sql, [socialContractId, facebookId, accessToken, applicationId], function(err, result, fields) {
        if (err) {
            if (err.errno == 1062) {
                callback({'success' : false, 'message': 'This Facebook account has already been connected'});
            } else if (err.errno == 1452) {
                callback({'success' : false, 'message': 'User ID does not match'});
            } else {
                callback({'success' : false, 'message': err});
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
var deleteFacebook = function(socialContractId, facebookId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM FBAccounts WHERE socialContractId = ? AND facebookId = ?;";
    var query = conn.query(sql, [socialContractId, facebookId], function(err, result, fields) {
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
var addInstagram = function(socialContractId, accessToken, instagramId, username, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO InstagramAccounts VALUE(?, ?, ?, ?);";
    var query = conn.query(sql, [socialContractId, instagramId, accessToken, username], function(err, result, fields) {
        if (err) {
            if (err.errno == 1062) {
                callback({'success' : false, 'message': 'This Instagram account has already been connected'});
            } else if (err.errno == 1452) {
               callback({'success' : false, 'message': 'User ID does not match'});
            }
        } else if (result.affectedRows > 0) {
            callback({'success': true})
        } else {
            callback({'success' : false, 'message': err.message})
        }
        conn.close();
    });
}

// deletes a Instagram account from the database
var deleteInstagram = function(socialContractId, instagramId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "DELETE FROM InstagramAccounts WHERE socialContractId = ? AND instagramId = ?;";
    var query = conn.query(sql, [socialContractId, instagramId], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success': false, 'message': 'Instagram account does not exist'});
        }
        conn.close();
    });
}

// returns all the Twitter accounts for a user
var getTwitterAccounts = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT * FROM TwitterAccounts WHERE socialContractId = ?;";
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if (err) throw err;
        callback({"accounts": result});
        conn.close();
    });
}

// returns all the Facebook accounts for a user
var getFacebookAccounts = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT * FROM FBAccounts WHERE socialContractId = ?;";
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if (err) throw err;
        callback({"accounts": result});
        conn.close();
    });
}

// returns all the Instagram accounts for a user
var getInstagramAccounts = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT * FROM InstagramAccounts WHERE socialContractId = ?;";
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if (err) throw err;
        callback({"accounts": result});
        conn.close();
    });
}

// add a new item to the Twitter queue
var addTwitterQueue = function(requestingUser, twitterId, goal, type, mediaId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO Queue VALUES(0, 0, ?);";
    var query = conn.query(sql, [goal], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            var requestId = result.insertId

            var sql2 = "INSERT INTO TwitterQueue VALUES(?, ?, ?, ?, ?);";
            var query2 = conn.query(sql2, [requestId, requestingUser, twitterId, type, mediaId], function(err, result, fields) {
                if (err) {
                    callback({'success': false, 'message': 'Twitter account not owned by user'});
                } else {
                    if (result.affectedRows > 0) {
                        callback({'success': true});
                    } else {
                        callback({'success': false, 'message': 'Failed adding into FacebookQueue'});
                    }
                }
            });
        } else {
            callback({'success': false, 'message': 'Failed adding into Queue'});
        }
        conn.close();
    });
}

// add a new item to the Facebook queue
var addFacebookQueue = function(requestingUser, facebookId, goal, type, mediaId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO Queue VALUES(0, 0, ?);";
    var query = conn.query(sql, [goal], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            var requestId = result.insertId

            var sql2 = "INSERT INTO FacebookQueue VALUES(?, ?, ?, ?, ?);";
            var query2 = conn.query(sql2, [requestId, requestingUser, facebookId, type, mediaId], function(err, result, fields) {
                if (err) {
                    callback({'success': false, 'message': 'Facebook account not owned by user'});
                } else {
                    if (result.affectedRows > 0) {
                        callback({'success': true});
                    } else {
                        callback({'success': false, 'message': 'Failed adding into FacebookQueue'});
                    }
                }

            });
        } else {
            callback({'success': false, 'message': 'Failed adding into Queue'});
        }
        conn.close();
    });
}

// add a new item to the Instagram queue
var addInstagramQueue = function(requestingUser, instagramId, goal, type, mediaId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "INSERT INTO Queue VALUES(0, 0, ?);";
    var query = conn.query(sql, [goal], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            var requestId = result.insertId

            var sql2 = "INSERT INTO InstagramQueue VALUES(?, ?, ?, ?, ?);";
            var query2 = conn.query(sql2, [requestId, requestingUser, instagramId, type, mediaId], function(err, result, fields) {
                if (err) {
                    callback({'success': false, 'message': 'Instagram account not owned by user'});
                } else {
                    if (result.affectedRows > 0) {
                        callback({'success': true});
                    } else {
                        callback({'success': false, 'message': 'Failed adding into InstagramQueue'});
                    }
                }
            });
        } else {
            callback({'success': false, 'message': 'Failed adding into Queue'});
        }
        conn.close();
    });
}

// changes the user's amount of coins
var editCoins = function(socialContractId, coins, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'UPDATE Users SET coins = ? WHERE userId = ?;';
    var query = conn.query(sql, [coins, socialContractId], function(err, result, fields) {
        if(err) throw err;
        if(result.affectedRows > 0) {
            callback({'success': true});
        } else {
            callback({'success': false, 'message': 'User does not exist'});
        }
        conn.close();
    });
}

var getCoins = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "SELECT coins from Users WHERE userId = ?;";
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if(err) throw err;
        if (result[0]) {
            callback({"success": true, "coins": result[0].coins});
        } else {
            callback({"success": false});
        }

        conn.close();
    });
}

// returns a user's Facebook queue
var getTwitterQueue = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'SELECT * FROM Queue NATURAL JOIN TwitterQueue WHERE requestingUser = ? ORDER BY requestId ASC';
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if(err) throw err;
        callback(result);
        conn.close();
    });
}

// returns a user's Facebook queue
var getFacebookQueue = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'SELECT * FROM Queue NATURAL JOIN FacebookQueue WHERE requestingUser = ? ORDER BY requestId ASC';
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if(err) throw err;
        callback(result);
        conn.close();
    });
}

// returns a user's Instagram queue
var getInstagramQueue = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'SELECT * FROM Queue NATURAL JOIN InstagramQueue WHERE requestingUser = ? ORDER BY requestId ASC';
    var query = conn.query(sql, [socialContractId], function(err, result, fields) {
        if(err) throw err;
        callback(result);
        conn.close();
    });
}

// inserts into ViewedMedia that a user has seen a particular piece of media
var insertViewedTwitter = function(socialContractId, mediaId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'INSERT INTO ViewedTwitter VAlUE(?, ?);';
    var query = conn.query(sql, [socialContractId, mediaId], function(err, result, fields) {
        if(err) {
            if (err.errno == 1062) {
                callback({"success": false, "message": "Entry already exists"});
            } else {
                throw err;
            }
        }

        callback({"success": true});
        conn.close();
    });
}

// inserts into ViewedMedia that a user has seen a particular piece of media
var insertViewedInstagram = function(socialContractId, mediaId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'INSERT INTO ViewedInstagram VAlUE(?, ?);';
    var query = conn.query(sql, [socialContractId, mediaId], function(err, result, fields) {
        if(err) {
            if (err.errno == 1062) {
                callback({"success": false, "message": "Entry already exists"});
            } else {
                throw err;
            }
        }

        callback({"success": true});
        conn.close();
    });
}

// gets items from Twitter queue that the user has not seen, are not their own content, and match interest profiles
var getDiscoverTwitter = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'SELECT * FROM TwitterQueue as t ' +
              'WHERE NOT t.requestingUser = ? ' +
              'AND (BINARY (SELECT interest FROM Users as u WHERE u.userId = t.requestingUser) & ' +
                   'BINARY (SELECT interest FROM Users as v WHERE v.userId = ?)) ' +
              'AND t.mediaId NOT IN ' +
                    '( ' +
                    'SELECT mediaId ' +
                    'FROM ViewedTwitter as vt ' +
                    'WHERE vt.userId = ? ' +
                    ') ' +
              'AND t.requestId NOT IN ' +
                    '( ' +
                    'SELECT requestId ' +
                    'FROM Queue as q ' +
                    'WHERE q.goal <= q.progress ' +
                    ');';
    var query = conn.query(sql, [socialContractId, socialContractId, socialContractId], function(err, result, fields) {
        if (err) throw err;
        callback(result);
        conn.close();
    });
}

// gets items from Instagram queue that the user has not seen, are not their own content, and match interest profiles
var getDiscoverInstagram = function(socialContractId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'SELECT * FROM InstagramQueue as i ' +
              'WHERE NOT i.requestingUser = ? ' +
              'AND (BINARY (SELECT interest FROM Users as u WHERE u.userId = i.requestingUser) & ' +
                   'BINARY (SELECT interest FROM Users as v WHERE v.userId = ? )) ' +
              'AND i.mediaId NOT IN ' +
                '( ' +
                'SELECT mediaId ' +
                'FROM ViewedInstagram as vi ' +
                'WHERE vi.userId = ? ' +
                ')' +
              'AND i.requestId NOT IN ' +
                '(' +
                'SELECT requestId ' +
                'FROM Queue as q ' +
                'WHERE q.goal <= q.progress ' +
                ');';
    var query = conn.query(sql, [socialContractId, socialContractId, socialContractId], function(err, result, fields) {
        if (err) throw err;
        callback(result);
        conn.close();
    });
}

// deletes a request from the Twitter queue
var deleteFromTwitterQueue = function(requestId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'DELETE FROM TwitterQueue WHERE requestId = ?';
    var query = conn.query(sql, [requestId], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            deleteFromQueue(requestId, function(queueResult) {
                if (queueResult.affectedRows > 0) {
                    callback({'success': true});
                } else {
                    callback({'success': false, 'message': 'Could not delete from Queue'});
                }
            });
        } else {
            callback({'success': false, 'message': 'Could not delete from TwitterQueue'});
        }
        conn.close();
    });
}

// deletes a request from the Instagram queue
var deleteFromInstagramQueue = function(requestId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'DELETE FROM InstagramQueue WHERE requestId = ?';
    var query = conn.query(sql, [requestId], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            deleteFromQueue(requestId, function(queueResult) {
                if (queueResult.affectedRows > 0) {
                    callback({'success': true});
                } else {
                    callback({'success': false, 'message': 'Could not delete from Queue'});
                }
            });
        } else {
            callback({'success': false, 'message': 'Could not delete from InstagramQueue'});
        }
        conn.close();
    });
}

// deletes a request from Queue
var deleteFromQueue = function(requestId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = 'DELETE FROM Queue WHERE requestId = ?';
    var query = conn.query(sql, [requestId], function(err, result, fields) {
        if (err) throw err;
        callback(result);
        conn.close();
    });
}

// updates the progress on a request
var updateProgress = function(requestId, callback) {
    const conn = mysql.createConnection(dbcredentials.db);
    var sql = "UPDATE Queue SET progress = progress + 1 WHERE requestId = ?";
    var query = conn.query(sql, [requestId], function(err, result, fields) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            callback({"success": true});
        } else {
           callback({"success": false});
        }
        conn.close();
    })
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
module.exports.getTwitterAccounts = getTwitterAccounts;
module.exports.getFacebookAccounts = getFacebookAccounts;
module.exports.getInstagramAccounts = getInstagramAccounts;
module.exports.addTwitterQueue = addTwitterQueue;
module.exports.addFacebookQueue = addFacebookQueue;
module.exports.addInstagramQueue = addInstagramQueue;
module.exports.editCoins = editCoins;
module.exports.getCoins = getCoins;
module.exports.getTwitterQueue = getTwitterQueue;
module.exports.getFacebookQueue = getFacebookQueue;
module.exports.getInstagramQueue = getInstagramQueue;
module.exports.insertViewedTwitter = insertViewedTwitter;
module.exports.insertViewedInstagram = insertViewedInstagram;
module.exports.getDiscoverTwitter = getDiscoverTwitter;
module.exports.getDiscoverInstagram = getDiscoverInstagram;
module.exports.deleteFromTwitterQueue = deleteFromTwitterQueue;
module.exports.deleteFromInstagramQueue = deleteFromInstagramQueue;
module.exports.updateProgress = updateProgress;
