// importing packages
const express = require('express');
const app = express();
const coapData = require('./routes/coapData');
// statci content
app.use(express.static('public'))
// middlewares
app.use(express.json());
// adding routes
app.use('/data', coapData);
// port
const port = process.env.PORT || 6600;
app.listen(port, () => console.log(`Listening on Port: ${port}`));