var crypto = require('crypto');
var User = require('../modules/user');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {
  app.get('/reg', function (req, res) {
    res.render('register', {title: '注册'});
  });
  app.get('/test', function (req, res) {
    res.render('test', {title: '注册'});
  });
  app.get('/log', function (req, res) {
    res.render('login', {title: '登录'});
  });
  app.get('/add', function (req, res) {
    res.render('addcourse', {title: '添加课程'});
  });
  app.post('/ajax_username_check',urlencodedParser,function(req,res) {
    console.log(req.body);
    res.json({valid:true});
  });

  app.post('/reg', function (req, res) {
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
    var md5 = crypto.createHash('md5'),
      password = md5.update(password).digest('hex');
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
        res.redirect('/');//注册成功后返回主页
      });
    });
  });
}