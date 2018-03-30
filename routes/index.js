
const route = require('express').Router();

route.get('/',function (req,res) {
    res.send('Hi There');
});


module.exports = route;
