const route = require('express').Router();


route.use('/student', require('./student'));
route.use('/company', require('./company'));

module.exports = route;