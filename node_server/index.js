var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

net.createServer(function(sock) {

  // We have a connection - a socket object is assigned to the connection automatically
  console.log('Connection on: ' + sock.remoteAddress +':'+ sock.remotePort);

  // Add a 'data' event handler to this instance of socket
  sock.on('data', function(data) {
    console.log('Data received from ' + sock.remoteAddress + ': ' + data);

    // Write the data back to the socket, the client will receive it as data from the server
    sock.write('You said... ' + data + '"');
  });

  // Add a 'close' event handler to this instance of socket
  sock.on('close', function(data) {
    console.log('Socket closed: ' + sock.remoteAddress +' '+ sock.remotePort);
  });

  sock.on('error', function(err) {
  	console.log(err);
  });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

