(function() {
	"use strict";

	var server = require("./server");
	var http = require("http");
	var fs = require("fs");
	var assert = require("assert"); //Por cómo trabaja nodeunit no tiene asserts en setUp y teardown así que utilizamos otra librería

	var TEST_HOME_PAGE = "generated/test/testHome.html";
	var TEST_404_PAGE = "generated/test/test404.html";

	//Se llama cada vez que finaliza un test al llamar a test.done()
	exports.tearDown = function(done) {
		cleanUpFile(TEST_HOME_PAGE);
		cleanUpFile(TEST_404_PAGE);
		
		done();
	};

	exports.test_servesHomePageFromFile = function(test) {
		//Integration test, not a unit test
		
		var expectedData = "This is home page file";
		fs.writeFileSync(TEST_HOME_PAGE, expectedData);

		httpGet("http://localhost:8080", function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.equals(expectedData, responseData, "response text");
			test.done();
		});
	};

	exports.test_returns404FromFileForEverythingExceptHomePage = function(test) {
		//Integration test, not a unit test

		var expectedData = "This is 404 page file";
		fs.writeFileSync(TEST_404_PAGE, expectedData);

		httpGet("http://localhost:8080/somethingArbitrary", function(response, responseData) {
			test.equals(404, response.statusCode, "status code");
			test.equals(expectedData, responseData, "404 text");
			test.done();
		});
	};

	exports.test_returnsHomePageWhenAskedForIndex = function(test) {
		var testDir = "generated/test";

		fs.writeFileSync(TEST_HOME_PAGE, "fooData");
		httpGet("http://localhost:8080/index.html", function(response, responseData) {
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_requiresHomePageParameter = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_requires404PageParameter = function(test) {
		test.throws(function() {
			server.start(TEST_HOME_PAGE);
		});
		test.done();
	};

	exports.test_requiresPortNumber = function(test) {
		//Comprueba que la función lance un error, en este caso por no pasar portNumber, si vemos el método start de server.js veremos que lanza un new Error
		test.throws(function() {
			server.start(TEST_HOME_PAGE, TEST_404_PAGE);
		});
		test.done();
	};

	exports.test_runsCallbackWhenStopCompletes = function(test) {
		server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080);
		server.stop(function(error) {
		 	test.done();	
		});
	};

	exports.test_stopSendErrorWhenNotRunning = function(test) {
		server.stop(function(error) {
			test.notEqual(error, undefined);
			test.done();
		});
	};

	function httpGet(url, callback) {
		server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080);
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

	function cleanUpFile(file) {
		if (fs.existsSync(file)) {
			fs.unlinkSync(file);
			assert.ok(!fs.existsSync(file), "could not delete test file: [" + file + "]");
		}
	}

}());
