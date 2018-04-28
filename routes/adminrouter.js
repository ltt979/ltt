var crypto = require('crypto');
var User = require('../modules/user');

var login = function (req, res) {
    var error = req.flash("error");
    res.render('admin/ad-login', {title: '登录',error: error});
}

var loginSubmit = function (req, res) {
    User.get(req.body.username, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            if (user.password == req.body.password && user.role ==="admin"){
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


exports.login = login;
exports.loginSubmit = loginSubmit;