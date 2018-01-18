const mysql = require('mysql2')

var dbcredentials = require('./dbcredentials');

//const conn = mysql.createConnection(dbcredentials);
const conn = mysql.createConnection({
  host: 'socialcontract.cche09jkxdr9.us-east-2.rds.amazonaws.com',
  database: 'socialcontract',
  port: 3306,
  user: 'anderson_ryan',
  password: 'TheRipGetRipper',
  reconnect: true,
  data_source_provider: 'rds',
  type: 'mysql'
});

var dbTest = function() {
    var sql = "INSERT INTO Users VALUES (\'test2@test.com\', \'password\', 10, 0);";
    conn.query(sql, function(err, result, fields) {
        if (err) throw err;
    });
};


module.exports.dbTest = dbTest;
