(function() {
	"use strict";

	var server = require("./server");
	var http = require("http");
	var fs = require("fs");
	var assert = require("assert"); //Por cómo trabaja nodeunit no tiene asserts en setUp y teardown así que utilizamos otra librería

	var TEST_FILE = "generated/test/test.html";

	//Se llama cada vez que finaliza un test al llamar a test.done()
	exports.tearDown = function(done) {
		if (fs.existsSync(TEST_FILE)) {
			fs.unlinkSync(TEST_FILE);
			assert.ok(!fs.existsSync(TEST_FILE), "could not delete test file: [" + TEST_FILE + "]");
		}
		done();
	};

	exports.test_serverServesHomePageFromFile = function(test) {
		//Integration test, not a unit test
		var testDir = "generated/test";
		var testData = "This is served from a file";

		fs.writeFileSync(TEST_FILE, testData);
		httpGet("http://localhost:8080", function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.equals(testData, responseData, "response text");
			test.done();
		});
	};

	exports.test_serverReturns404ForEverythingExceptHomePage = function(test) {
		//Integration test, not a unit test
		httpGet("http://localhost:8080/somethingArbitrary", function(response, responseData) {
			test.equals(404, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_serverReturnsHomePageWhenAskedForIndex = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";

		fs.writeFileSync(TEST_FILE, testData);
		httpGet("http://localhost:8080/index.html", function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.equals(testData, responseData, "response text");
			test.done();
		});
	};

	function httpGet(url, callback) {
		server.start(TEST_FILE ,8080);
		var request = http.get(url);
		request.on("response", function(response) {
			var receivedData = "";
			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				receivedData += chunk;
			});

			response.on("end", function() {
				server.stop(function() {
					callback(response, receivedData);
				});
			});
		});
	}

	exports.test_serverRequiresFileToServe = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_serverRequiresPortNumber = function(test) {
		//Comprueba que la función lance un error, en este caso por no pasar portNumber, si vemos el método start de server.js veremos que lanza un new Error
		test.throws(function() {
			server.start(TEST_FILE);
		});
		test.done();
	};

	exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
		server.start(TEST_FILE, 8080);
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
}());
