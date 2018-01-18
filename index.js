const express = require('express')
const app = express()

var dbconn = require('./Database/dbconn');

app.get('/test/', (req, res) => {
  res.send('Server reached successfully')
});
app.get('', (req, res) => {
	res.send('Default landing page')
});
app.get('/dbTest', (req, res) => {
    dbconn.dbTest();
    res.send('performing db test');
});
app.listen(3000, () => console.log('Server running on port 3000'))
