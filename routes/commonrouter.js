var News = require("../modules/news");

var index = function (req, res) {
  var msg = req.flash("msg");
  res.render('index', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}


var junior = function (req, res) {
  res.render('junior', {
    user: req.session.user
  });
  // console.log(JSON.stringify(req.session.user));
}

var adult = function (req, res) {
  res.render('adult', {
    user: req.session.user
  });
  // console.log(JSON.stringify(req.session.user));
}

var business = function (req, res) {
  res.render('business', {
    user: req.session.user
  });
  // console.log(JSON.stringify(req.session.user));
}

var overseas = function (req, res) {
  res.render('overseas', {
    user: req.session.user
  });
  // console.log(JSON.stringify(req.session.user));
}

var administrator_suggestion = function (req, res) {
  var msg = req.flash("msg");
  res.render('administrator_suggestion', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var newsdetail = function (req, res) {
  var newsId = req.params.id;
  News.getById(newsId, function (err, theNews) {
    if (err) {
      req.flash("msg","未找新闻，为您跳转到主页。");
     return index(req,res);
    }
    res.render("newsdetail", {
      user: req.session.user,
      news: theNews
    });
  })
}

var newslist = function (req, res) {
  var msg = req.flash("msg");
  res.render('newslist', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var suggestion_box = function (req, res) {
  var msg = req.flash("msg");
  res.render('suggestion_box', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var download = function (req, res) {
  var msg = req.flash("msg");
  res.render('download', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var addcourse_adult = function (req, res) {
  var msg = req.flash("msg");
  res.render('user/addcourse_adult', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var addcourse_business = function (req, res) {
  var msg = req.flash("msg");
  res.render('user/addcourse_business', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}
var addcourse_junior = function (req, res) {
  var msg = req.flash("msg");
  res.render('user/addcourse_junior', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}
var addcourse_overseas = function (req, res) {
  var msg = req.flash("msg");
  res.render('user/addcourse_overseas', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

var administrator_suggestion = function (req, res) {
  var msg = req.flash("msg");
  res.render('admin/administrator_suggestion', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}
exports.index = index;
exports.junior = junior;
exports.adult = adult;
exports.business = business;
exports.overseas = overseas;
exports.newsdetail = newsdetail;
exports.administrator_suggestion = administrator_suggestion;
exports.newsdetail = newsdetail;
exports.newslist = newslist;
exports.suggestion_box = suggestion_box;
exports.download = download;
exports.addcourse_adult = addcourse_adult;
exports.addcourse_business = addcourse_business;
exports.addcourse_junior = addcourse_junior;
exports.addcourse_overseas = addcourse_overseas;
exports.administrator_suggestion = administrator_suggestion;


