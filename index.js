const express = require('express')
const app = express()

var dbconn = require('./Database/dbconn');

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

app.listen(3000, () => console.log('Server running on port 3000'))
