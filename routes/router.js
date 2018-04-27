var commonrouter = require('./commonrouter');
var userrouter = require('./usersrouter');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var util = require('util');

module.exports = function (app) {
    app.get('/', commonrouter.index);
    app.get('/reg', userrouter.reg);
    app.post('/regSubmit', userrouter.regSubmit);
    app.get('/log', userrouter.login);
    app.get('addcourse', userrouter.addcourse);
    app.post('/ajax_username_check', urlencodedParser, userrouter.ajax_username_check);
}
