var settings = require("../settings");
var mongodb = require("./mongodbUtil");
var ObjectId = require("bson").ObjectID;

function News(news) {
    this.title = news.title;
    this.content = news.content;
    this.createTime = news.createTime || new Date();

}
//save news
News.prototype.save = function (callback) {
    var db = mongodb.getMongoDB();
    var news = {
        title: this.title,
        content: this.content,
        createTime: this.createTime || new Date()
    };
    //打开数据库
    //读取 users 集合
    db.collection(settings.news, function (err, collection) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //将用户数据插入 users 集合
        collection.insert(news, {
            safe: true
        }, function (err, result) {
            if (err) {
                return callback(err);//错误，返回 err 信息
            }
            callback(null, result.ops[0]);//成功！err 为 null，并返回存储后的用户文档
        });
    });
};

News.getPaginator = function (currentPage, pageSize, query, callback) {
    var db = mongodb.getMongoDB();
    db.collection('news').find(query).skip((currentPage - 1) * pageSize).limit(+pageSize).sort({ "_id": -1 }).toArray(function (err, docs) {
        if (err) {
            console.log(error);
            return;
        }
        callback(docs);
    });
}


var getTotalCount = function (query) {
    var db = mongodb.getMongoDB();
    return new Promise(function (reslove, reject) {
        db.collection(settings.news).count(query, function (err, count) {
            if (err) {
                reject(err);
            }
            reslove(count);
        });
    })
}
News.getPageCount = function (pageSize, query) {
    var db = mongodb.getMongoDB();
    return new Promise(function (resolve, reject) {
        var promise = getTotalCount(query);
        promise.then(function (totalCount) {
            resolve(Math.floor(totalCount / pageSize) + (totalCount % pageSize == 0 ? 0 : 1));
        });
    });
}

News.getById = function (id, callback) {
    var db = mongodb.getMongoDB();
    db.collection(settings.news).findOne({ _id: ObjectId(id) }, function (err, result) {
        if (err) {
            console.error(error);
            callback(err);
            return;
        }
        if(!result){
            callback(new Error("沒有找到对应的新闻"));
            return;
        }
        return callback(null, result);
    });
}

module.exports = News;