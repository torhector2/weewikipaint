"use strict";

var server = require("./server");
var http = require("http");

exports.tearDown = function(done) {
	server.stop(function() {
		done();
	});
};

exports.testServerRespondsToGetRequests = function(test) {
	server.start();
	http.get("http://localhost:8080", function(response) {
		response.on("data", function(){});
		test.done();
	});
};