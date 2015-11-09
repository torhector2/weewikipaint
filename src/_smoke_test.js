//launch the server in the same way it happens in production
//get a page
//confirm we got something

(function() {
	"use strict";

	var child_process = require("child_process");
	var http = require("http");
	var fs = require("fs");
	var child;

	exports.setUp = function(done) {
		runServer(done);
	};

	exports.tearDown = function(done) {
		child.on("exit", function(code, signal) {
			done();
		});
		child.kill();
	};

	exports.test_canGetHomePage = function(test) {	
		httpGet("http://localhost:5000", function(response, receivedData) {
			console.log("Callback home");
			var foundHomePage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
			test.ok(foundHomePage, "home page should have contained test marker");
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {	
		httpGet("http://localhost:5000/snonexistant.html", function(response, receivedData) {
			console.log("Callback 404");
			var found404Page = receivedData.indexOf("WeeWikiPaint 404 page") !== -1;
			test.ok(found404Page, "404 page should have contained test marker");
			test.done();
		});
	};

	function runServer(callback) {
		var commandLine = parseProcFile();
		child = child_process.spawn(commandLine[0], commandLine.slice(1));

		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk) {
			if (chunk.trim().indexOf("Server started") !== -1) {
				callback();
			}
		});
		child.stderr.on("data", function(chunk) {
			console.log("stderr: " + chunk);
		});
	}

	function parseProcFile() {
		var procFile = fs.readFileSync("ProcFile", "utf8");
		var matches = procFile.match(/^web:\s*((\S)+(\s+))+$/); //matches 'web: foo bar baz'

		console.log("Matches: " + matches);
		console.log(procFile);
		return ["node", "src/server/weewikipaint", "5000"];
	}

	//TODO: ELiminate duplication w/ _server_test.js
	function httpGet(url, callback) {
		var request = http.get(url);
		request.on("response", function(response) {
			var receivedData = "";
			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				receivedData += chunk;
			});

			response.on("end", function() {
				callback(response, receivedData);
			});
		});
	}
}());
