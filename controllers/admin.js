const mongodb = require('mongodb');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    edit: req.query.edit,
  });
};

exports.postAddProduct = (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { imageUrl } = req.body;

  new Product(title, price, description, imageUrl, null, req.user._id)
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect('/');
  }

  Product.findById(req.params.productId)
    .then((product) => {
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        edit,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId } = req.body;
  const { userId } = req.body;
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { imageUrl } = req.body;

  // Product is returned by findById is MongoDB model, but not is our class Product model. So, we have to create new Product
  new Product(title, price, description, imageUrl, productId, new mongodb.ObjectId(userId))
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  Product.delete(req.body.productId)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
