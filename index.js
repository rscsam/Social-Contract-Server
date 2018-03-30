const express = require('express')
const crypto = require('crypto')
const app = express()

var bodyParser = require('body-parser');
var dbconn = require('./Database/dbconn');
var profile = require('./profileendpoints');
var socialmedia = require('./socialmediaendpoints');

app.use( bodyParser.json() );


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

// update the users interest profile
app.post('/updateInterestProfile', (req, res) => profile.updateInterestProfile(req, res) );

// gets the user's interest profile
app.post('/interestProfile', (req, res) => profile.getInterestProfile(req, res) );

// adds a Twitter account
app.post('/addTwitter', (req, res) => socialmedia.addTwitter(req, res) );

// adds a Facebook account
app.post('/addFacebook', (req, res) => socialmedia.addFacebook(req, res) );

// adds an Instagram account
app.post('/addInstagram', (req, res) => socialmedia.addInstagram(req, res) );

// deletes a Twitter account
app.post('/deleteTwitter', (req, res) => socialmedia.deleteTwitter(req, res) );

// deletes a Facebook account
app.post('/deleteFacebook', (req, res) => socialmedia.deleteFacebook(req, res) );

// deletes an Instagram account
app.post('/deleteInstagram', (req, res) => socialmedia.deleteInstagram(req, res) );

// returns a list of a user's Twitter accounts
app.post('/twitterAccounts', (req, res) => socialmedia.getTwitterAccounts(req, res) );

// returns a list of a user's Facebook accounts
app.post('/facebookAccounts', (req, res) => socialmedia.getFacebookAccounts(req, res) );

// returns a list of a user's Instagram accounts
app.post('/instagramAccounts', (req, res) => socialmedia.getInstagramAccounts(req, res) );

// returns a user's current coin total
// params: socialContractId
app.post('/getCoins', (req, res) => profile.getCoins(req, res) );

// adds an item to the Twitter queue and edits user total accordingly
// params: socialContractId, cost, twitterId, goal, type, mediaId
app.post('/addTwitterQueue', (req, res) => socialmedia.addTwitterQueue(req, res) );

// adds an item to the Facebook queue and edits user total accordingly
// params: socialContractId, cost, facebookId, goal, type, mediaId
app.post('/addFacebookQueue', (req, res) => socialmedia.addFacebookQueue(req, res) );

// adds an item to the Instagram queue and edits user total accordingly
// params: socialContractId, cost, instagramId, goal, type, mediaId
app.post('/addInstagramQueue', (req, res) => socialmedia.addInstagramQueue(req, res) );

// gets a user's queue
// params: socialContractId
app.post('/getQueue', (req, res) => profile.getQueue(req, res) );

// marks that a user has seen content already
// params: socialContractId, mediaId, type
app.post('/addViewed', (req, res) => socialmedia.addViewed(req, res) );

// deletes an item from the queue
// params: requestId, type
app.post('/deleteFromQueue', (req, res) => socialmedia.deleteFromQueue(req, res) );

// gets discover queue
// params: socialContractId, type
app.post('/getDiscover', (req, res) => socialmedia.getDiscover(req, res) );

// adds 1 to the progress of a queue item
//params: requestId
app.post('/updateProgress', (req, res) => profile.updateProgress(req, res) );

app.listen(3000, () => console.log('Server running on port 3000'));
