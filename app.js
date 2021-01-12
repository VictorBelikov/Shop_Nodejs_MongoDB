const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const err404Controller = require('./controllers/404');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); // Set our template engine
app.set('views', 'views'); // Указываем папку, где лежат наши вьюхи

// Парсит body запросов из JSON строки в Object, чтобы иметь доступ через req.body.someparam
app.use(bodyParser.urlencoded({ extended: false }));

// Public available for 'public' directory
app.use(express.static('public'));

// Make User available from anywhere of our application
app.use((req, res, next) => {
  User.findById('5ffc12ca49abbc834021d131')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(err404Controller.get404);

module.exports = app;
