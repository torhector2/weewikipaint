/*global desc, task, jake, fail, complete */
(function (){
"use strict";

desc("Build and test");
task("default", ["lint", "test"]);

desc("Lint everything");
task("lint", [], function() {
	var lint = require("./build/lint/lint_runner.js");

	var files = new jake.FileList();
	files.include("**/*.js");
	files.exclude("node_modules");
	var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
	if (!passed) {
		fail("Lint failed");
	}
});

desc("Test everything");
task("test", [], function() {
	var reporter = require("nodeunit").reporters.minimal;
	reporter.run(["src/server/_server_test.js"], null, function(failures) {
		if (failures) fail("Test fails");
		complete();
	});
}, {async: true}); //Ponemos la opción de true para que se ejecuten de manera asíncrona, debemos esperar a que pasen los test antes de paras a la task "Integrate"

desc("Integrate");
task("integrate", ["default"], function() {
	console.log("1. Make sure 'git status' is clean");
	console.log("2. Build on the integration box");
	console.log("	a. Walk over to integration box. Vamos al server de integración continua");
	console.log("	b. 'git pull. Actualizamos el código en la rama principal (no en master)'");
	console.log("	c. 'jake'");
	console.log("	d. 'If jake fails, stop! Try Again after fixing the issue!'");
	console.log("3. 'git checkout' integration. Nos cambiamos a la rama integration.");
	console.log("4.	'git merge master --no-f --log' Mergeamos master en integration");
	console.log("5. 'git checkout master. Nos cambiamos a master");
});

function nodeLintOptions() {
	var options = {
		bitwise: true,
		curly: false,
		eqeqeq: true,
		forin: true,
		immed: true,
		latedef: true,
		newcap: true,
		noarg: true,
		noempty: true,
		nonew: true,
		regexp: true,
		undef: true,
		strict: true,
		trailing: true,
		node: true
	};
	return options;
}
})();
