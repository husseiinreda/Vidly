const express = require('express');
const winston = require('winston');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();
require('./startup/validation')();
//require('./startup/prod')(app);

const port = process.env.port || 3000;
const server = app.listen(port,()=>winston.info(`Listening to ${port}... `));

module.exports = server;