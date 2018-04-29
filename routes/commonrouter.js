var index = function (req, res) {
  var msg = req.flash("msg");
  res.render('index', {
    user: req.session.user,
    msg: msg
  });
  // console.log(JSON.stringify(req.session.user));
}

exports.index = index;