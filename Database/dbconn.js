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
    var sql = "UPDATE Users SET email = ? WHERE userId = ?;";
    var query = conn.query(sql, [email, userId], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

// changes the user's password
var editPassword = function(password, userId, callback) {
    var sql = "UPDATE Users SET password = ? WHERE userId = ?;";
    var query = conn.query(sql, [password, userId], function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            callback(false);
        } else {
            callback(true);
        }
    });
}


module.exports.login = login;
module.exports.register = register;
module.exports.checkUser = checkUser;
module.exports.getSalt = getSalt;
module.exports.editPassword = editPassword;
module.exports.editEmail = editEmail;
