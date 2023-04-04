const mongodb =require('mongodb');
const MongoClieant = mongodb.MongoClient;
let _db;
const mongoConnect =(callback)=>{
    MongoClieant.connect('mongodb+srv://kush:kush123@cluster0.w7jn5ey.mongodb.net/shop?retryWrites=true&w=majority')
    .then((client) => {
        console.log('connected');
        _db=client.db();
        callback();
    }).catch((err) => {
        console.log(err);
        throw err;
    });
};

const getDb = ()=>{
    if(_db){
        return _db
    }
    throw "No database found";
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
