const http = require('http');
const port = process.env.port || 3000;
const app = require('./app');

//When we get a request in the server execute the following line
const server = http.createServer(app);


server.listen(port);

