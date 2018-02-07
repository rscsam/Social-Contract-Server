const express = require('express')
const crypto = require('crypto')
const app = express()

var bodyParser = require('body-parser');
var dbconn = require('./Database/dbconn');
var profile = require('./profileendpoints');
var socialmedia = require('./socialmediaendpoints');

app.use( bodyParser.json() );

//holds a username and the current nonce
var nonceMap = new Map();

app.get('/test/', (req, res) => {res.send('Server reached successfully')});

app.get('', (req, res) => {res.send('Default landing page')});


// you use req to get parameters sent to the endpoint. res is how you send things back
// you'll need to pass a callback to most database functions to execute after the function returns

// do this before login to get the user's salt and a one-time nonce
app.post('/loginInit', (req, res) => profile.logininit(req, res) );

// logs in the user if password is correct
app.post('/login', (req, res) => profile.login(req, res) );

// do this before registration to get salt
app.post('/initRegistration', (req, res) => profile.initregistration(req, res) );

// adds user to the database
app.post('/register', (req, res) => profile.register(req, res) );

// updates the user's email address
app.post('/changeEmail', (req, res) => profile.changeEmail(req, res) );

// updates the user's password
app.post('/changePassword', (req, res) => profile.changePassword (req, res) );


app.listen(3000, () => console.log('Server running on port 3000'))
