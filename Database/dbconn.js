const mysql = require('mysql2')

var dbcredentials = require('./dbcredentials');

const conn = mysql.createConnection(dbcredentials.db);

// for any database query, be sure to protect against sql injection by escaping all user entry
// this means that you put a ? instead of concatenating the strings
// then you put in the data that needs to be placed there in an array after "sql" in the query args

// gets user's password
var login = function(email, callback) {
    var sql = "SELECT password FROM Users WHERE email = ?;";
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        callback(result[0].password);
    });
};

// adds new user to database
var register = function(email, password, salt, callback) {
    var sql = "INSERT INTO Users VALUES (?, ?, ?, 10, 0);";
    conn.query(sql, [email, password, salt], function(err, result, fields) {
        callback(err);
    });
}

//
var checkUser = function(email, callback) {
    var sql = "SELECT COUNT(*) as count FROM Users WHERE email = ?;";
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        if (result[0].count > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

var getSalt = function(email, callback) {
    var sql = "SELECT salt FROM Users WHERE email = ?;";
    var query = conn.query(sql, [email], function(err, result, fields) {
        if (err) throw err;
        callback(result[0].salt);
    });
}


module.exports.login = login;
module.exports.register = register;
module.exports.checkUser = checkUser;
module.exports.getSalt = getSalt;
