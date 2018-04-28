
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Connect to mongoose
mongoose.connect("mongodb://localhost/placements");
const db = mongoose.connection;

// Routes
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));
app.use('/', express.static(__dirname + "/static"));

// App Listening to port 3456
app.listen(3456, function () {
    console.log("Server started on http://localhost:3456");
});