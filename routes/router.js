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
    app.post('/loginSubmit', userrouter.loginSubmit);
    app.get('/logout', userrouter.logout);
    app.get('/addcourse', userrouter.addcourse);
    app.post('/ajax_username_check', urlencodedParser, userrouter.ajax_username_check);
    app.get('/junior', commonrouter.junior);
    app.get('/adult', commonrouter.adult);
    app.get('/business', commonrouter.business);
    app.get('/overseas', commonrouter.overseas);
    app.get('/newsdetail', commonrouter.newsdetail);
    app.get("/newsdetail/:id", commonrouter.newsdetail);
    app.get("/download", commonrouter.download);
    app.get("/addcourse_adult", commonrouter.addcourse_adult);
    app.get("/addcourse_business", commonrouter.addcourse_business);
    app.get("/addcourse_junior", commonrouter.addcourse_junior);
    app.get("/addcourse_overseas", commonrouter.addcourse_overseas);
    app.get("/newslist", commonrouter.newslist);
    app.get("/suggestion_box", commonrouter.suggestion_box);
    app.post("/suggestSubmit", commonrouter.suggestSubmit);
    app.get("/idea", commonrouter.idea);
    app.get("/introduction", commonrouter.introduction);
    app.get("/teacher", commonrouter.teacher);
    app.post('/common/getNewsPage', commonrouter.getNewsPage);
    app.post('/common/getNewsTotalCount', commonrouter.getNewsTotalCount);
    app.get('/resourceDetail/:id', commonrouter.resourceDetail);

    //admin
    app.get('/admin/login', adminrouter.login);
    app.post('/admin/loginSubmit', adminrouter.loginSubmit);
    app.get('/admin/administrator_coursetoadd', adminrouter.administrator_coursetoadd);
    app.post('/admin/addCourseSubmit', upload.fields([{name: 'imageFile'}, {name: "zipFile"}]), adminrouter.addCourseSubmit);
    app.post('/admin/getProductTotalCount', adminrouter.getProductTotalCount);
    app.post('/admin/getProductPage', adminrouter.getProductPage);
    app.post('/admin/getSuggestionTotalCount', adminrouter.getSuggestionTotalCount);
    app.post('/admin/getSuggestionPage', adminrouter.getSuggestionPage);
    app.get('/admin/addnews', adminrouter.addnews);
    app.post('/admin/addnewsAjax', adminrouter.addnewsAjax);
    app.get("/admin/administrator_suggestion", adminrouter.administrator_suggestion);
    app.post("/admin/delcourseAjax", adminrouter.delcourseAjax);
    app.post("/admin/delNewsAjax", adminrouter.delNewsAjax);

    //pc
    app.get('/pc/adult', userrouter.adult);
    app.get('/pc/pcenter', userrouter.pcenter);
    app.post('/pc/getProductTotalCount', userrouter.getProductTotalCount);
    app.post('/pc/getProductPage', userrouter.getProductPage);
    app.post('/pc/addcourse', userrouter.addcourse);
    app.post('/pc/delcourseAjax', userrouter.delcourseAjax);
    app.post('/pc/getResourceByUserIdAjax', userrouter.getResourceByUserIdAjax);

}
