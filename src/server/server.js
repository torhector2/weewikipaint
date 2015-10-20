"use strict";

var http = require("http");
var fs = require("fs");
var server;

exports.start = function(fileToServe, portNumber) {
	if (!portNumber) throw new Error("Port number is required");
	server = http.createServer();
	server.on("request", function(request, response) {
		if (request.url === "/" || request.url === "/index.html") {
			fs.readFile(fileToServe, function(err, data) {
				if (err) throw err; //TODO: Fix me
				response.end(data);	
			});
		} else {
			response.statusCode = 404;
			response.end();
		}
	});

	server.listen(portNumber);
};

exports.stop = function(callback) {
	server.close(callback);
};