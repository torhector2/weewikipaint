"use strict";

var server = require("./server");
var assert = require("assert");

exports.testNothing = function(test) {
	assert.equal(3, server.number(), "number");
	test.done();
};