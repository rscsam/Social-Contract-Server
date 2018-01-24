const express = require('express')
const crypto = require('crypto')
const app = express()

var bodyParser = require('body-parser');
var dbconn = require('./Database/dbconn');

app.use( bodyParser.json() );

app.get('/test/', (req, res) => {
  res.send('Server reached successfully')
});

app.get('', (req, res) => {
	res.send('Default landing page')
});

app.get('/loginTest', (req, res) => {
    dbconn.login('test@test.com', 'password', function(result) {
        res.send(result);
    });
});

app.get('/registerTest', (req, res) => {
    dbconn.register('test3@test.com', 'password', function(result) {
        res.send(result);
    });
});

app.post('/initRegistration', (req, res) => {
    dbconn.checkUser(req.body.email, function(result) {
        if (result == false) {
            crypto.randomBytes(32, (err, buff) => {
                if (err) throw err;
                res.send({"result": buff.toString('hex'), 'success' : true});
            });
        } else {
            res.send({"result" : "User already exists", 'success' : false});
        }
    });
});

app.post('/register', (req, res) => {
    console.log(req.body);
    dbconn.register(req.body.email, req.body.password, req.body.salt, function(err) {
        if(err) {
            res.send({'success' : false, 'message' : err});
        } else {
            res.send({'success' : true});
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'))
