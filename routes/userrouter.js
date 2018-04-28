var crypto = require('crypto');
var User = require('../modules/user');


var reg = function (req, res) {
  res.render('register', {title: '注册'});
}
var login = function (req, res) {
  res.render('login', {title: '登录'});
}
var addcourse = function (req, res) {
  res.render('addcourse', {title: '添加课程'});
}

var ajax_username_check = function (req, res) {
  User.get(req.body.username, function (err, user) {
    if (err) {
      res.json({valid: false});
    } else {
      if (null == user) {
        res.json({valid: true});
      } else {
        res.json({valid: false});
      }
    }
  })
}

var regSubmit = function (req, res) {
  var email = req.body.email,
    name = req.body.username,
    password = req.body.password,
    password_re = req.body['password_confirm'],
    sex = req.body.sex;
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/reg');//返回注册页
  }
  //生成密码的 md5 值
  // var md5 = crypto.createHash('md5'),
  //   password = md5.update(password).digest('hex');
  var newUser = new User({
    name: name,
    password: password,
    email: email,
    sex: sex
  });
  //检查用户名是否已经存在 
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      // res.redirect('/');//注册成功后返回主页
      pcenter(req, res);
    });
  });
}

var loginSubmit = function (req, res) {
  User.get(req.body.username, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      if (user.password == req.body.password) {
        req.session.user = user;
        req.flash('success', '登录成功!');
        res.redirect('/');//登录成功后返回主页
      }
    } else {
      req.flash('error', '用户名或密码错误!');
      res.redirect('/login');//登录失败停留login页面
    }
  });
}

var pcenter = function (req, res) {
  checkLogin(req, res);
  res.render('user/personal_center', {});
}

var checkLogin = function (req, res) {
  var user = req.session.user;
  if (!user) {
    login(req, res);
  }
}

exports.reg = reg;
exports.regSubmit = regSubmit
exports.ajax_username_check = ajax_username_check;
exports.login = login;
exports.loginSubmit = loginSubmit;
exports.addcourse = addcourse;
exports.pcenter = pcenter;