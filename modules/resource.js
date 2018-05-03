var mongodb = require("./mongodbUtil");
var pageSize = 10;
function Resource(count, time, level, bundle, operator,type_one,type_two,createTime,filePath) {
  this.count = count;
  this.time = time;
  this.level = level;
  this.bundle = bundle;
  this.type_one = type_one,
  this.type_two = type_two,
  this.operator = operator;
  this.createTime = createTime;
  this.filePath = filePath;
};

module.exports = Resource;

Resource.getPaginator = function (currentPage,pageSize,query,callback) {
  var db = mongodb.getMongoDB();
  db.collection('resources').find(query).skip((currentPage - 1) * pageSize).limit(+pageSize).sort({"_id":-1}).toArray(function (err, docs) {
    if (err) {
      console.log(error);
      return;
    }
    callback(docs);
  });;
}

var getTotalCount = function (query) {
  return new Promise(function (reslove, reject) {
    var db = mongodb.getMongoDB();
    db.collection('resources').count(query,function (err, count) {
      if (err) {
        reject(err);
      }
      reslove(count);
    });
  })
}
Resource.getPageCount = function (pageSize,query) {
  return new Promise(function (resolve, reject) {
    var promise = getTotalCount(query);
    promise.then(function (totalCount) {
      resolve(Math.floor(totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1));
    });
  });


}

