const db = require('mongodb');

const { MongoClient } = db;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    'mongodb+srv://V1ctoR:WwMEMQ54Y7T1K1Xk@online-shop.5yjc5.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
    .then((client) => {
      console.log('!! Connected to MongoDB !!');
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log('Error while connecting to MongoDB: ', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found');
};

module.exports = { mongoConnect, getDb };
