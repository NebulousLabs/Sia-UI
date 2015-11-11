'use strict';

// Libraries required for testing
const Application = require('spectron').Application;
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const Path = require('path');
const Fs = require('fs');

// Chai's should syntax is executed to edit Object to have Object.should
var should = Chai.should();
// Chai's should syntax is extended to deal well with Promises
Chai.use(ChaiAsPromised);

// The one app that this suite is testing is Sia-UI
describe('Sia-UI', function () {
	var app;
	var client;

	// Starts a new session and assigns spectron's Application instance to a
	// variable, app, available to all tests
	beforeEach(function () {
		app = new Application({
			path: Path.join(__dirname, '../node_modules/.bin/electron'),
			args: ['--app=' + Path.join(__dirname, '..')],
		});
		return app.start();
	});

	// Extends ChaiAsPromised's syntax with spectron's electron-specific
	// functions and assigns spectron's WebDriverIO properties to a variable,
	// client, available to all tests
	beforeEach(function () {
		client = app.client;
		ChaiAsPromised.transferPromiseness = client.transferPromiseness;
	});

	// Close Sia-UI session after each test-suite
	afterEach(function () {
		if (app && app.isRunning()) {
			return app.stop();
		}
	});

	// Test basic startup properties
	describe('on startup', function () {
		it('opens Sia-UI properly', function () {
			return client.waitUntilWindowLoaded()
				.getWindowCount().then(function(count) {
					Fs.readdir(Path.join(__dirname, '../plugins'), function(err, plugins) {
						should.not.exist(err);
						// Not sure why, but the plugins sometimes register as
						// part of the Window Count
						count.should.equal(1 || 1 + plugins.length);
					});
				})
				.isWindowMinimized().should.eventually.be.false
				.isWindowDevToolsOpened().should.eventually.be.false
				.isWindowVisible().should.eventually.be.true
				.isWindowFocused().should.eventually.be.true
				.getWindowWidth().should.eventually.be.above(0)
				.getWindowHeight().should.eventually.be.above(0)
				.getArgv().then(function(argv) {
					argv[0].should.contain('electron');
					argv[1].should.contain('Sia-UI');
				});
		});
	});
});
