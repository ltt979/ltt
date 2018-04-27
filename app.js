var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var route = require('./routes/router');
var crypto = require('crypto');
var User = require('./modules/user.js');
var util = require('util');


// var indexRouter = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
// var usersRouter = require('./routes/users');

var app = express();
app.set('views', __dirname + '/public/html');
app.set("view engine","ejs");
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// app.get("/",router.showIndex);

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongodbURL = util.format('mongodb://%s:%s/%s', settings.host, settings.port, settings.db);
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    url: mongodbURL,
    db: settings.db,
    host: settings.host,
    port: settings.port
  }),
  resave: true,
  saveUninitialized: true
}));

route(app);
module.exports = app;


