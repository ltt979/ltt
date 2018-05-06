var crypto = require('crypto');
var User = require('../modules/user');
var Admin = require('../modules/admin');
var Resource = require("../modules/resource");
var path = require("path");
var News = require("../modules/news");
var settings = require("../settings");

var getAdmin = function (req, res) {
    // 如果不存在登录的管理用户，则跳到管理员登录页
    var user = req.session.user;
    if (user == null || user.role != "admin") {
        res.writeHead(302, {'Location': "/admin/login"});
        res.end();
        return;
    }
    return user;
}

var login = function (req, res) {
    var error = req.flash("error");
    res.render('admin/ad_login', {title: '登录', error: error});
}

var loginSubmit = function (req, res) {
    User.get(req.body.username, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            if (user.password == req.body.password && user.role === "admin") {
                req.session.user = user;
                req.flash('success', '管理员登录成功!');
                res.redirect('/admin/administrator_coursetoadd');//登录成功后返回管理中心页面
            }
        } else {
            req.flash('error', '用户名或密码错误!');
            res.redirect('/admin/login');//登录失败停留login页面
        }
    });
}


var administrator_coursetoadd = function (req, res) {
    var admin = getAdmin(req, res);
    if (admin == null) {
        return;
    }
    res.render("admin/administrator_coursetoadd", {
        user: admin
    });
}

var addCourseSubmit = function (req, res) {
    var admin = getAdmin(req, res);
    if (admin == null) {
        return;
    }
    var filePath = req.file.path; 
    var visitPath = filePath.slice(filePath.indexOf("public") + 6).replace("/\\/g", "/")

    var resource = {
        count: req.body.count,
        time: req.body.time,
        level: req.body.level,
        bundle: req.body.bundle,
        type_one: req.body.type_one,
        type_two: req.body.type_two,
        operator : admin._id,
        visitPath: visitPath
    }
    Admin.addCourse(resource, function (error, resource) {
        if (error) {
            res.json({"error": "添加课程出错"});
        } else {
            res.json({"success": resource});
        }
    });
}


var getProductTotalCount = function (req, res) {
    var pageSize = req.body.pageSize;
    Resource.getPageCount(pageSize).then(function (pageCount) {
        res.json({"pageCount": pageCount});
    }).catch(function (error) {
        console.error(error);
        res.json({"pageCount": 10});
    });
}

var getNewsTotalCount = function (req, res) {
    var pageSize = req.body.pageSize;
    News.getPageCount(pageSize).then(function (pageCount) {
        res.json({"pageCount": pageCount});
    }).catch(function (error) {
        console.error(error);
        res.json({"pageCount": 10});
    });
}

var getProductPage = function (req, res) {
    var pageSize = req.body.pageSize;
    var currentPage = req.body.currentPage;
    Resource.getPaginator(currentPage, pageSize,null,function(docs){
        res.json({"resources": docs});
    });
}

var getNewsPage = function (req, res) {
    var pageSize = req.body.pageSize;
    var currentPage = req.body.currentPage;
    News.getPaginator(currentPage, pageSize,null,function(docs){
        res.json({"resources": docs});
    });
}

var addnewsAjax = function(req,res){
    var news = new News({
        title  : req.body.title,
        content : req.body.content,
        createTime : new Date()
    });

    news.save(function(err,addNews){
        if(err){
            res.json({"msg":"添加新闻出错","error":true});
        }else{
            res.json({'msg':'添加新闻成功'});
        }
    });
}


var addnews = function(req,res){
    var admin = getAdmin(req, res);
    if (admin == null) {
        return;
    }
    res.render("admin/administrator_newstoadd", {
        user: admin
    });
}


exports.login = login;
exports.loginSubmit = loginSubmit;
exports.administrator_coursetoadd = administrator_coursetoadd;
exports.addCourseSubmit = addCourseSubmit;
exports.getProductTotalCount = getProductTotalCount;
exports.getNewsTotalCount = getNewsTotalCount;
exports.getProductPage = getProductPage;
exports.getNewsPage = getNewsPage;
exports.addnewsAjax = addnewsAjax;
exports.addnews = addnews;