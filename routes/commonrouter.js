
exports.index = function (req, res) {
  res.render('index', {
    user: req.session.user
  });
  // console.log(JSON.stringify(req.session.user));
}
