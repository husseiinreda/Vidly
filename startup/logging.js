const winston = require('winston');
require('express-async-errors');

module.exports = function(){
    winston.exceptions.handle(
        //new winston.transports.Console(),
        new winston.transports.File({ 
            filename:'uncaughtExceptions.log',
        })
    );
    winston.add(new winston.transports.File({ filename:'logFile.log'}));
}