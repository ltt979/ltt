var mongodb = require("./mongodbUtil");
var pageSize = 10;
function Resource(count, time, level, bundle, operator,type,createTime) {
  this.count = count;
  this.time = time;
  this.level = level;
  this.bundle = bundle;
  this.type = type
  this.operator = operator;
  this.createTime = createTime;
};

module.exports = Resource;

Resource.getPaginator = function (currentPage,pageSize,callback) {
  var db = mongodb.getMongoDB();
  db.collection('resources').find({}).skip((currentPage - 1) * pageSize).limit(+pageSize).toArray(function (err, docs) {
    if (err) {
      console.log(error);
      return;
    }
    callback(docs);
  });;
}

var getTotalCount = function () {
  return new Promise(function (reslove, reject) {
    var db = mongodb.getMongoDB();
    db.collection('resources').count(function (err, count) {
      if (err) {
        reject(err);
      }
      reslove(count);
    });
  })
}
Resource.getPageCount = function (pageSize) {
  return new Promise(function (resolve, reject) {
    var promise = getTotalCount();
    promise.then(function (totalCount) {
      resolve(Math.floor(totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1));
    });
  });


}

