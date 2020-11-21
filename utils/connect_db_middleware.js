const MongoClient = require('mongodb').MongoClient
const dbConfig = require('./dbConfig');

const connectDB = (req, res, next) => {
  MongoClient.connect(dbConfig.dbURL, {
    useUnifiedTopology: true,
  }, (err, client) => {
    if (!err) {
      console.log('mongodb connection successful');
      req.db = client.db(dbConfig.dbName);
      next();
    } else {
      console.log('DB connection Error', err);
      next(err);
    }
  });
}

module.exports = connectDB;