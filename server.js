const http = require('http');

const app = require('./app');
const { mongoConnect } = require('./util/database');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

mongoConnect(() => server.listen(port, () => console.log(`Server is listening on port ${port} ...`)));

// ========================= Create server more simple way ==============================
// app.listen(3000, () => console.log('Server is running on port 3000...'));

// Express source code:
// app.listen = function() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };
