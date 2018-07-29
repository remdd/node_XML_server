var net 		= require('net'),
		rl 			= require('readline'),
		fs			= require('fs'),
		xml2js	= require('xml2js'),
		morgan	= require('morgan');

var parseString = require('xml2js').parseString;

var HOST = '127.0.0.1';
var PORT = 6969;

var reconnectHandler;
var reconnectTime = 1000;

var client;


//	Get command from user and send to server
function sendCommand() {
	getInput(function(command) {
		console.log(command);
		connect(command);
	});
}

//	Get user input string to send as command to server
function getInput(callback) {
	var userPrompt = "Enter your command...";
	var r = rl.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	r.question(userPrompt + '\n', function(answer) {
		r.close();
		console.log("User entered: " + answer);
		callback(answer);
	});
}

//	Connect to target socket and transfer command when connected
function connect(command) {
	client = new net.Socket();
	client.connect(PORT, HOST, function() {
	  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
	  client.write(command);
	});

	//	Handle connection errors by retrying every X ms
	client.on('error', function(err) {
		console.log(err.code);
		reconnectHandler = setTimeout(function() {
			clearTimeout(reconnectHandler);
			connect();
		}, reconnectTime);
	});

	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	client.on('data', function(data) {

	  console.log('Reply from server: ' + data);
	  // Close the client socket completely
	  client.destroy();

	});

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
		console.log('Connection closed');
	});
}

function updateXml(newValue, callback) {
	fs.readFile('status.xml', 'utf-8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			console.log(data);
			parseString(data, function(err, result) {
				if(err) {
					console.log(err);
				} else {
					console.log(result);

					var json = result;
					json.root.status[0] = newValue;
					console.log(json);

					var builder = new xml2js.Builder();
					var xml = builder.buildObject(json);

					fs.writeFile('status.xml', xml, function(err, data) {
						if(err) {
							console.log(err);
						} else {
							console.log(data);
							console.log("Successfully updated status XML");
							callback();
						}
					});
				}
			});
		}
	});
}

updateXml('Changed!', sendCommand);
