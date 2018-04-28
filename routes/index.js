
const route = require('express').Router();

route.get('/',function (req,res) {
    res.send('Hi there, use /api/company or /api/student/ to use the APIs :) ');
});


route.get('/api/',function (req,res) {
    res.send('Hi there, use /company/ or /student/ to use the APIs:) ');
});


route.get('/api/student/',function (req,res) {
    res.send('Try /all to get all students :)');
});


route.get('/api/company/',function (req,res) {
    res.send('Try /all to get all companies :)');
});

module.exports = route;
