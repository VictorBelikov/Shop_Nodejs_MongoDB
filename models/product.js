const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let operation;
    if (this._id) {
      operation = db.collection('products').updateOne({ _id: { $eq: this._id } }, { $set: this });
    } else {
      operation = db.collection('products').insertOne(this); // create a new one
    }
    return operation
      .then((result) => console.log(result))
      .catch((err) => console.log('Error while saving/updating new Product: ', err));
  }

  static fetchAll() {
    return getDb()
      .collection('products')
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log('Error while fetching Products: ', err));
  }

  static findById(id) {
    return getDb()
      .collection('products')
      .find({ _id: { $eq: new mongodb.ObjectId(id) } })
      .next() // take the first object from the cursor
      .then((product) => product)
      .catch((err) => console.log('Error while fetching specific Products: ', err));
  }

  static delete(id) {
    return getDb()
      .collection('products')
      .deleteOne({ _id: { $eq: new mongodb.ObjectId(id) } })
      .then((result) => console.log(result))
      .catch((err) => console.log('Error while deleting Products: ', err));
  }
}

module.exports = Product;
