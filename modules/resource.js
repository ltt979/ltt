var mongodb = require("./mongodbUtil");
var settings = require("../settings");
var pageSize = 10;
function Resource(resource) {
  this.count = resource.count;
  this.time = resource.time;
  this.level = resource.level;
  this.bundle = resource.bundle;
  this.type_one = resource.type_one;
  this.type_two = resource.type_two;
  this.operator = resource.operator;
  this.createTime = resource.createTime;
  this.filePath = resource.filePath;
};

module.exports = Resource;

Resource.getPaginator = function (currentPage, pageSize, query, callback) {
  var db = mongodb.getMongoDB();
  db.collection(setting.resource).find(query).skip((currentPage - 1) * pageSize).limit(+pageSize).sort({"_id": -1}).toArray(function (err, docs) {
    if (err) {
      console.log(error);
      return;
    }
    callback(docs);
  });
}


var getTotalCount = function (query) {
  return new Promise(function (reslove, reject) {
    var db = mongodb.getMongoDB();
    db.collection(setting.resource).count(query, function (err, count) {
      if (err) {
        reject(err);
      }
      reslove(count);
    });
  })
}
Resource.getPageCount = function (pageSize, query) {
  return new Promise(function (resolve, reject) {
    var promise = getTotalCount(query);
    promise.then(function (totalCount) {
      resolve(Math.floor(totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1));
    });
  });


}

