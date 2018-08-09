const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/config');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth/', auth);
app.use('/user/', user);

module.exports = app;