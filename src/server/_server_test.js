"use strict";

var server = require("./server");
var http = require("http");

exports.tearDown = function(done) {
	server.stop(function() {
		done();
	});
};


exports.test_serverReturnsHelloWorld = function(test) {
	server.start(8080);
	var request = http.get("http://localhost:8080");
	request.on("response", function(response) {
		var receivedData = false;
		response.setEncoding("utf8");

		test.equals(200, response.statusCode);

		response.on("data", function(chunk) {
			receivedData = true;
			test.equals("Hello World", chunk, "response text");
		});
		response.on("end", function() {
			test.ok(receivedData, "should have received response data");
			test.done();
		});
	});
};