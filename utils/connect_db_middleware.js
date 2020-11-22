const MongoClient = require("mongodb").MongoClient;
const dbConfig = require("../dbConfig");

const getDBConnection = () => {
  MongoClient.connect(
    dbConfig.dbURL,
    {
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        console.log("DB connection Error", err);
        throw err;
        return;
      }
      console.log("mongodb connection successful");
      return client.db(dbConfig.dbName);
    }
  );
};

module.exports = getDBConnection;
