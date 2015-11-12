//launch the server in the same way it happens in production
//get a page
//confirm we got something
/*jshint regexp:false*/

(function() {
	"use strict";

	var child_process = require("child_process");
	var http = require("http");
	var procfile = require("procfile");
	var fs = require("fs");
	var child;

	exports.test_isOnWeb = function(test) {
		httpGet("http://weewikipainttor.herokuapp.com", function(response, receivedData) {
			console.log("Callback home");
			var foundHomePage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
			test.ok(foundHomePage, "home page should have contained test marker");
			test.done();
		});
	};

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
