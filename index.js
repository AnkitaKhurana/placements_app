
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');

//const passport = require('./auth/passport');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Connect to mongoose
mongoose.connect("mongodb://localhost/placements");
const db = mongoose.connection;



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//



// app.use(cookieParser('my super secret'));
// app.use(expressSession({
//     secret: 'my super secret',
//     resave: false,
//     saveUninitialized: false
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));
app.use('/', express.static(__dirname + "/static"));



app.listen(3456, function () {
    console.log("Server started on http://localhost:3456");
});