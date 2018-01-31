const express = require('express')
const crypto = require('crypto')
const app = express()

var bodyParser = require('body-parser');
var dbconn = require('./Database/dbconn');

//holds a username and the current nonce
var nonceMap = new Map();

app.use( bodyParser.json() );

app.get('/test/', (req, res) => {
  res.send('Server reached successfully')
});

app.get('', (req, res) => {
	res.send('Default landing page')
});


// you use req to get parameters sent to the endpoint. res is how you send things back
// you'll need to pass a callback to most database functions to execute after the function returns

// do this before login to get the user's salt and a one-time nonce
app.post('/loginInit', (req, res) => {
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
});

// logs in the user if password is correct
app.post('/login', (req, res) => {
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
});

// do this before registration to get salt
app.post('/initRegistration', (req, res) => {
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
});

// adds user to the database
app.post('/register', (req, res) => {
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
});

// updates the user's email address
app.post('/changeEmail', (req, res) => {
    console.log(req.body);
    res.send({'success' : true, 'message' : 'Change email endpoint hit.'});
}

// updates the user's password
app.post('changePassword', (req, res) => {
    console.log(req.body);
    res.send({'success' : true, 'message' : 'Change password endpoint hit.'});
}

app.listen(3000, () => console.log('Server running on port 3000'))
