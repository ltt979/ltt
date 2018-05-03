var commonrouter = require('./commonrouter');
var userrouter = require('./userrouter');
var adminrouter = require('./adminrouter');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var upload = require("../modules/upload");
var util = require('util');

var multer = require("multer");
// var upload = multer({dest: '/public/uploads/'})


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
    app.get('/admin/administrator_coursetoadd',adminrouter.administrator_coursetoadd);
    app.post('/admin/addCourseSubmit', upload.single('imageFile'),adminrouter.addCourseSubmit);
    app.post('/admin/getProductTotalCount', adminrouter.getProductTotalCount);
    app.post('/admin/getProductPage', adminrouter.getProductPage);
    
    
    //pc
    app.get('/pc/adult',userrouter.adult);
    app.get('/pc/pcenter',userrouter.pcenter);
    app.post('/pc/getProductTotalCount', userrouter.getProductTotalCount);
    app.post('/pc/getProductPage', userrouter.getProductPage);
    app.post('/pc/addcourse',userrouter.addcourse);

}
