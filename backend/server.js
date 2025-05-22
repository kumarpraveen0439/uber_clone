const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

// Creates an HTTP server using the Express app as the request handler.
const server = http.createServer(app);

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});