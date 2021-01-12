const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = id;
  }

  save() {
    return getDb()
      .collection('users')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log('Error while saving/updating new User: ', err));
  }

  getCart() {
    const db = getDb();
    const productIDs = this.cart.items.map((p) => p.productId);
    if (productIDs.length > 0) {
      return db
        .collection('products')
        .find({ _id: { $in: productIDs } }) // find all the products with IDs in the productIDs array
        .toArray()
        .then((products) => {
          // Есть ли в БД такие же товары, как и в корзине
          if (products.length > 0) {
            return products.map((p) => ({
              ...p,
              quantity: this.cart.items.find((el) => el.productId.toString() === p._id.toString()).quantity,
            }));
          }
          // Чистим корзину, т.к. в БД больше нет таких товаров
          this.cart = { items: [] }; // clear user cart in object
          return db.collection('users').updateOne({ _id: { $eq: this._id } }, { $set: { cart: { items: [] } } }); // clear user cart in db
        })
        .catch((err) => console.log('Error while getting products from User cart: ', err));
    }
    return Promise.resolve([]);
  }

  addToCart(product) {
    const newCart = { ...this.cart };
    const newProduct = { productId: product._id, title: product.title, price: product.price, quantity: 1 };
    const productIndex = newCart.items.findIndex((p) => p.productId.toString() === product._id.toString());

    if (productIndex >= 0) {
      newCart.items[productIndex].quantity += 1;
    } else {
      newCart.items.push(newProduct);
    }

    return getDb()
      .collection('users')
      .updateOne({ _id: { $eq: this._id } }, { $set: { cart: newCart } })
      .catch((err) => console.log('Error while updating User cart: ', err));
  }

  deleteFromCart(id) {
    const newItems = this.cart.items.filter((p) => p.productId.toString() !== id);

    return getDb()
      .collection('users')
      .updateOne({ _id: { $eq: this._id } }, { $set: { cart: { items: newItems } } })
      .catch((err) => console.log('Error while deleting from User cart: ', err));
  }

  createOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const newOrder = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
            email: this.email,
          },
        };
        return db.collection('orders').insertOne(newOrder);
      })
      .then(() => {
        this.cart = { items: [] }; // clear user cart in object
        return db.collection('users').updateOne({ _id: { $eq: this._id } }, { $set: { cart: { items: [] } } }); // clear user cart in db
      })
      .catch((err) => console.log('Error while creating Order: ', err));
  }

  getOrders() {
    return getDb()
      .collection('orders')
      .find({ 'user._id': { $eq: this._id } })
      .toArray()
      .then((orders) => orders)
      .catch((err) => console.log('Error while getting Orders: ', err));
  }

  static findById(id) {
    return getDb()
      .collection('users')
      .findOne({ _id: { $eq: new mongodb.ObjectId(id) } })
      .then((user) => user)
      .catch((err) => console.log('Error while fetching specific User: ', err));
  }
}

module.exports = User;
