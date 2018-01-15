const express = require('express')
const app = express()

app.get('/test/', (req, res) => {
  res.send('Server reached successfully')
});
app.get('', (req, res) => {
	res.send('Default landing page')
});
app.listen(3000, () => console.log('Server running on port 3000'))
