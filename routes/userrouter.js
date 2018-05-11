var crypto = require('crypto');
var User = require('../modules/user');
var Resource = require('../modules/resource');


var reg = function (req, res) {
  res.render('register', {title: '注册'});
}
var login = function (req, res) {
  res.render('login', {title: '登录'});
}
// ajax add course
var addcourse = function (req, res) {
  var user = checkLogin(req, res);
  var courseID = req.body.courseID;
  if (!courseID) {
    res.json({"msg": "请选择需要添加的课程"});
  }
  User.addCourse(user._id, courseID, function (err, updateUser) {
    if (err) {
      res.json({"msg": "添加课程出错"});
    }
    if (updateUser != null) {
      req.session.user = updateUser;
      res.json({"msg": "添加成功", "success": true});
    }
  });
}

// ajax add course
var delcourseAjax = function (req, res) {
  var user = checkLogin(req, res);
  var courseID = req.body.courseID;
  if (!courseID) {
    res.json({"msg": "请选择需要移除的课程"});
  }
  User.delCourse(user._id, courseID, function (err, updateUser) {
    if (err) {
      res.json({"msg": "移除课程出错"});
    }
    if (updateUser != null) {
      req.session.user = updateUser;
      res.json({"msg": "移除成功", "success": true});
    }
  });
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
      req.session.user = user;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
      // pcenter(req, res);
    });
  });
}

var loginSubmit = function (req, res) {
  User.get(req.body.username, function (err, user) {
    if (err) {
      req.flash('error', err);
      res.redirect('/admin_index');
      return;
    }
    if (user && user.password == req.body.password) {
      req.session.user = user;
      req.flash('success', '登录成功!');
      res.redirect('/');//登录成功后返回主页
      return;
    } else {
      req.flash('error', '用户名或密码错误!');
      res.redirect('/login');//登录失败停留login页面
      return;
    }
  });
}

var pcenter = function (req, res) {
  var user = checkLogin(req, res);
  res.render('user/personal_center', {user: user});
}

var checkLogin = function (req, res) {
  var user = req.session.user;
  if (!user || !user.name) {
    login(req, res);
    return;
  } else {
    return user;
  }
}

var logout = function (req, res) {
  if (req.session && req.session.user) {
    var name = req.session.user.name || '';
    req.session.user = null;
    req.flash("msg", "你好，" + name + "已经退出");
  }
  res.redirect("/");
}


var adult = function (req, res) {
  var user = checkLogin(req, res);
  res.render("/adult", {user: user});
}


var getProductTotalCount = function (req, res) {
  var pageSize = req.body.pageSize;
  var type_one = req.body.type_one;
  var type_two = req.body.type_two;
  var query = {
    type_one: type_one,
    type_two: type_two
  }
  Resource.getPageCount(pageSize, query).then(function (pageCount) {
    res.json({"pageCount": pageCount});
  }).catch(function (error) {
    console.error(error);
    res.json({"pageCount": 10});
  });
}

var getProductPage = function (req, res) {
  var user = checkLogin(req, res);
  var pageSize = req.body.pageSize;
  var currentPage = req.body.currentPage;
  var query = {
    type_one: req.body.type_one
  }
  if (req.body.type_two){
    query.type_two = req.body.type_two;
  }
  Resource.getPaginator(currentPage, pageSize, query, function (docs) {
    for (var i in docs) {
      if (user.own && user.own.indexOf(docs[i]["_id"].toHexString()) > -1) {
        docs[i].owned = true;
      } else {
        docs[i].owned = false;
      }
    }
    res.json({"resources": docs});
  });
}

var getResourceByUserIdAjax = function (req, res) {
  var user = checkLogin(req, res);
  Resource.getResourceByUserId(user._id, function (err, resources) {
    if (err) {
      res.json({"msg": err});
    }
    for (var i in resources) {
      if (user.own && user.own.indexOf(resources[i]["_id"].toHexString()) > -1) {
        resources[i].owned = true;
      } else {
        resources[i].owned = false;
      }
    }
    res.json({"success": true, resources: resources});
  })
}




exports.reg = reg;
exports.regSubmit = regSubmit
exports.ajax_username_check = ajax_username_check;
exports.login = login;
exports.loginSubmit = loginSubmit;
exports.addcourse = addcourse;
exports.pcenter = pcenter;
exports.logout = logout;
exports.adult = adult;
exports.getProductTotalCount = getProductTotalCount;
exports.getProductPage = getProductPage;
exports.delcourseAjax = delcourseAjax;
exports.getResourceByUserIdAjax = getResourceByUserIdAjax;