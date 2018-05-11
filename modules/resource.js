
var mongodb = require("./mongodbUtil");
var settings = require("../settings");
var ObjectId = require("bson").ObjectID;
var inspect = require('util').inspect;
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
  db.collection(settings.resources).find(query).skip((currentPage - 1) * pageSize).limit(+pageSize).sort({"_id": -1}).toArray(function (err, docs) {
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
    db.collection(settings.resources).count(query, function (err, count) {
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

Resource.getResourceByUserId = function (userId, callback) {
  var db = mongodb.getMongoDB();
  db.collection(settings.resources, function (err, resourceCollection) {
    if (err) {
      callback(err);
      return;
    }
    var userCollection = db.collection(settings.user);
    userCollection.findOne({_id: ObjectId(userId)}, function (err, user) {
      // console.log(inspect(user));
      if (null == user || !user.own) {
        callback(new Error("user not found by id " + userId));
        return;
      }

      var ownArray = user.own;
      var ownObjectArray = [];
      for (var i = 0; i < ownArray.length; i++) {
        ownObjectArray.push(ObjectId(ownArray[i]));
      }
      // console.log("own ownObjectArray is " + ownObjectArray);
      if (!ownArray || ownArray.length == 0) {
        callback(null, []);
        return;
      }
      resourceCollection.find({
        _id: {$in: ownObjectArray}
      }).toArray(function (err, resources) {
        if (err) {
          callback(err); return;
        }
        callback(null, resources);
      });
    });
  })
}


Resource.delResourceById = function (resourceId, callback) {
  var db = mongodb.getMongoDB();
  var resourcesCol = db.collection(settings.resources);
  resourcesCol.findOneAndDelete({_id: ObjectId(resourceId)}, function (err, result) {
    callback(err, result);
  });
}
//test of getResourceByUserId
// setTimeout(() => {
//   Resource.getResourceByUserId('5af2ee686809071e70d06a17',function(err,resoures){
//     if(err){
//       console.log(err);
//       return;
//     }
//     console.log("resourc of the user is " + inspect(resoures));
//   });
// }, 2000);
//test delResourceById
// setTimeout(() => {
//   Resource.delResourceById('5af4238241a05823e88319ee',function(err,result){
//     if(err){
//       console.log(err);
//     }
//     console.log(inspect(result));
//   })
// }, 2000);


Resource.getById = function (id, callback) {
  var db = mongodb.getMongoDB();
  db.collection(settings.resources).findOne({_id: ObjectId(id)}, function (err, result) {
    if (err) {
      console.error(error);
      callback(err);
      return;
    }
    if (!result) {
      callback(new Error("沒有找到对应的课程"));
      return;
    }
    return callback(null, result);
  });
}