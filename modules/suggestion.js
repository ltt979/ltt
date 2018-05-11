
var settings = require("../settings");
var mongodb = require("./mongodbUtil");
var ObjectId = require("bson").ObjectID;
var inspect = require('util').inspect;

function Suggestion(suggestion) {
    this.userId = suggestion.userId;
    this.content = suggestion.content;
    this.createTime = suggestion.createTime || new Date();
    this.username = suggestion.username;
}
//save suggestion
Suggestion.prototype.save = function (callback) {
    var db = mongodb.getMongoDB();
    var suggestion = {
        userId: this.userId ||'未登录用户',
        content: this.content,
        createTime: this.createTime || new Date(),
        username : this.username
    };
    db.collection(settings.suggestion, function (err, collection) {
        if (err) {
            return callback(err);
        }
        collection.insert(suggestion, {
            safe: true
        }, function (err, result) {
            if (err) {
                return callback(err);//错误，返回 err 信息
            }
            callback(null, result.ops[0]);//成功！err 为 null
        });
    });
};

Suggestion.getPaginator = function (currentPage, pageSize, query, callback) {
    var db = mongodb.getMongoDB();
    db.collection(settings.suggestion).find(query).skip((currentPage - 1) * pageSize).limit(+pageSize).sort({"_id": -1}).toArray(function (err, docs) {
        if (err) {
            console.log(error);
            callback(err);
            return;
        }
        callback(null, docs);
    });
}


var getTotalCount = function (query) {
    var db = mongodb.getMongoDB();
    return new Promise(function (reslove, reject) {
        db.collection(settings.suggestion).count(query, function (err, count) {
            if (err) {
                reject(err);
            }
            reslove(count);
        });
    })
}
Suggestion.getPageCount = function (pageSize, query) {
    var db = mongodb.getMongoDB();
    return new Promise(function (resolve, reject) {
        var promise = getTotalCount(query);
        promise.then(function (totalCount) {
            resolve(Math.floor(totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1));
        });
    });
}

Suggestion.getById = function (id, callback) {
    var db = mongodb.getMongoDB();
    db.collection(settings.suggestion).findOne({_id: ObjectId(id)}, function (err, result) {
        if (err) {
            console.error(error);
            callback(err);
            return;
        }
        if (!result) {
            callback(new Error("沒有找到对应的意见"));
            return;
        }
        return callback(null, result);
    });
}

Suggestion.delById = function (id, callback) {
    var db = mongodb.getMongoDB();
    db.collection(settings.suggestion).findOneAndDelete({_id: ObjectId(id)}, function (err, result) {
        if (err) {
            console.error(error);
            callback(err);
            return;
        }
        if (!result) {
            callback(new Error("沒有找到对应的意见"));
            return;
        }
        return callback(null, result);
    });
}

// setTimeout(() => {
//     Suggestion.delById('5af45d24fabe387c80e70bae',function (err,result) {
//        console.log(inspect(err));
//         console.log(inspect(result));
//     })    
// }, 2000);

module.exports = Suggestion;