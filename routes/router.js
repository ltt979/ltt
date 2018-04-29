var commonrouter = require('./commonrouter');
var userrouter = require('./userrouter');
var adminrouter = require('./adminrouter');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var util = require('util');

module.exports = function (app) {
    app.get('/', commonrouter.index);
    app.get('/reg', userrouter.reg);
    app.post('/regSubmit', userrouter.regSubmit);
    app.get('/login', userrouter.login);
    app.post('/loginSubmit',userrouter.loginSubmit);
    app.get('/logout',userrouter.logout);
    app.get('addcourse', userrouter.addcourse);
    app.post('/ajax_username_check', urlencodedParser, userrouter.ajax_username_check);

    //admin
    app.get('/admin/login',adminrouter.login);
    app.post('/admin/loginSubmit', adminrouter.loginSubmit);
    app.get('/user/pcenter',userrouter.pcenter);
}
