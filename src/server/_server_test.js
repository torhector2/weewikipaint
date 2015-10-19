"use strict";

var server = require("./server");
var http = require("http");
var fs = require("fs");

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
			server.stop(function() {
				test.done();
			});
		});
	});
};

exports.test_serverServeAFile = function(test) {
	//Integration test, not a unit test
	var testDir = "generated/test";
	var testFile = testDir + "/test.html";

	fs.writeFileSync(testFile, "Hello world");

	test.done();
};

exports.test_serverRequiresPortNumber = function(test) {
	//Comprueba que la función lance un error, en este caso por no pasar portNumber, si vemos el método start de server.js veremos que lanza un new Error
	test.throws(function() {
		server.start();
	});
	test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
	server.start(8080);
	server.stop(function(error) {
		test.done();	
	});
};

exports.test_stopErrorsWhenNotRunning = function(test) {
	server.stop(function(error) {
		test.notEqual(error, undefined);
		test.done();
	});
};