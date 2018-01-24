const mysql = require('mysql2')

var dbcredentials = require('./dbcredentials');

const conn = mysql.createConnection(dbcredentials.db);

var login = function(email, password, callback) {
    var sql = "SELECT COUNT(*) as count FROM Users WHERE email = ? AND password = ?;";
    var query = conn.query(sql, [email, password], function(err, result, fields) {

        if (err) throw err;
        if (result[0].count > 0) {
          callback(true);
        } else {
          callback(false);
        }
    });
};

var register = function(email, password, salt, callback) {
    var sql = "INSERT INTO Users VALUES (?, ?, ?, 10, 0);";
    conn.query(sql, [email, password, salt], function(err, result, fields) {
        callback(err);
    });
}

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


module.exports.login = login;
module.exports.register = register;
module.exports.checkUser = checkUser;
