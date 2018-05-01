var crypto = require('crypto');
var User = require('../modules/user');
var Admin = require('../modules/admin');
var Resource = require("../modules/resource");
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
    res.render('admin/ad-login', {title: '登录', error: error});
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
                res.redirect('/');//登录成功后返回主页
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
    res.render("admin/administrator-coursetoadd", {
        user: admin
    });
}

var addCourseSubmit = function (req, res) {
    var admin = getAdmin(req, res);
    if (admin == null) {
        return;
    }
    var resource = {
        count: req.body.count,
        time: req.body.time,
        level: req.body.level,
        bundle: req.body.bundle,
        type : req.body.type,
        operator : admin._id
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

var getProductPage = function (req, res) {
    var pageSize = req.body.pageSize;
    var currentPage = req.body.currentPage;
    Resource.getPaginator(currentPage, pageSize,function(docs){
        res.json({"resources": docs});
    });
}




exports.login = login;
exports.loginSubmit = loginSubmit;
exports.administrator_coursetoadd = administrator_coursetoadd;
exports.addCourseSubmit = addCourseSubmit;
exports.getProductTotalCount = getProductTotalCount;
exports.getProductPage = getProductPage;