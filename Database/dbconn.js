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

var register = function(email, password, callback) {
    var sql = "INSERT INTO Users VALUES (?, ?, 10, 0);";
    conn.query(sql, [email, password], function(err, result, fields) {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });
}

module.exports.login = login;
module.exports.register = register;
