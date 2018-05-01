var mongodb = require("./mongodbUtil");
function Admin(user) {
  this.name = user.name;
  this.id = user._id;
};

module.exports = Admin;


Admin.addCourse = function (resource, callback) {
  var db = mongodb.getMongoDB();
  db.collection('resources', function (err, collection) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    resource.createTime = new Date();
    collection.insert(resource, {
      safe: true
    }, function (err, result) {
      if (err) {
        return callback(err);//错误，返回 err 信息
      }
      callback(null, result.ops[0]);//成功！err 为 null，并返回存储后的用户文档
    });
  });
};
