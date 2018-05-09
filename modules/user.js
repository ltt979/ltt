var mongodb = require("./mongodbUtil");
var ObjectId = require("bson").ObjectID;
var inspect = require('util').inspect;

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
  this.sex = user.sex;
};

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
  //要存入数据库的用户文档
  var user = {
    name: this.name,
    password: this.password,
    email: this.email,
    sex: this.sex
  };
  //打开数据库
  var db = mongodb.getMongoDB();
  //读取 users 集合
  db.collection('users', function (err, collection) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //将用户数据插入 users 集合
    collection.insert(user, {
      safe: true
    }, function (err, result) {
      if (err) {
        return callback(err);//错误，返回 err 信息
      }
      callback(null, result.ops[0]);//成功！err 为 null，并返回存储后的用户文档
    });
  });
};

//读取用户信息
User.get = function (name, callback) {
  //打开数据库
  var db = mongodb.getMongoDB();
  //读取 users 集合
  db.collection('users', function (err, collection) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //查找用户名（name键）值为 name 一个文档
    collection.findOne({
      name: name
    }, function (err, user) {
      if (err) {
        return callback(err);//失败！返回 err 信息
      }
      callback(null, user);//成功！返回查询的用户信息
    });
  });
};

// 个人添加课程
User.addCourse = function (userID, courseID, callback) {
  var db = mongodb.getMongoDB();
  //读取 users 集合
  db.collection('users', function (err, collection) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //查找用户名（name键）值为 name 一个文档
    collection.findOneAndUpdate({
      _id: ObjectId(userID)
    },
      {$addToSet: {own: courseID}},
      {
        projection: {name: 1, _id: 1, own: 1, email: 1, sex: 1},
        returnOriginal: false
        , upsert: true
      }, function (err, result) {
        if (err || result.ok != 1) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, result.value);//成功！返回查询的用户信息
      });
  });
}
// person delete course  '5af02458c92bd72024a72b19'
User.delCourse = function (userID, courseID, callback) {
  var db = mongodb.getMongoDB();
  //读取 users 集合
  db.collection('users', function (err, collection) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //查找用户名（name键）值为 name 一个文档
    collection.findOneAndUpdate({
      _id: ObjectId(userID)
    },
      {$pull: {own: courseID}},
      {
        projection: {name: 1, _id: 1, own: 1, email: 1, sex: 1},
        returnOriginal: false
        , upsert: true
      }, function (err, result) {
        if (err || result.ok != 1) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, result.value);//成功！返回查询的用户信息
      });
  });
}
//del test
// setTimeout(() => {
//   User.delCourse('5af02458c92bd72024a72b19', 7, function (err, user) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(inspect(user));
//   });
// }, 2000);