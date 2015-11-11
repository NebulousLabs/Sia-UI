'use strict';

// Libraries required for testing
var Application = require('spectron').Application;
var Chai = require('chai');
var ChaiAsPromised = require('chai-as-promised');
var Path = require('path');

// Chai's should syntax is executed to edit Object to have Object.should
var should = Chai.should();
// Chai's should syntax is extended to deal well with Promises
Chai.use(ChaiAsPromised);

// The one app that this suite is testing is Sia-UI
describe('main process', function() {
	var app;
	var client;

	// Starts a new session and assigns spectron's Application instance to a
	// variable, app, available to all tests
	before('start electron', function() {
		app = new Application({
			path: Path.join(__dirname, '../node_modules/.bin/electron'),
			args: [Path.join(__dirname, '..')],
		});
		return app.start();
	});

	// Extends ChaiAsPromised's syntax with spectron's electron-specific
	// functions and assigns spectron's WebDriverIO properties to a variable,
	// client, available to all tests
	before('transfer spectron methods', function() {
		client = app.client;
		ChaiAsPromised.transferPromiseness = client.transferPromiseness;
	});

	// Close session after each test-suite
	after('stop electron', function() {
		if (app && app.isRunning()) {
			return app.stop();
		}
	});

	// Test basic startup properties
	describe('on startup', function() {
		it('opens a window', function() {
			return client.getWindowCount().should.eventually.equal(1);
		});
		it('isn\'t minimized', function() {
			return client.isWindowMinimized().should.eventually.be.false;
		});
		it('has devtools line commented out', function() {
			return client.isWindowDevToolsOpened().should.eventually.be.false;
		});
		it('is visible', function() {
			return client.isWindowVisible().should.eventually.be.true;
		});
		it('is in focus', function() {
			return client.isWindowFocused().should.eventually.be.true;
		});
		it('has non-zero width and height', function() {
			return client.getWindowWidth().should.eventually.be.above(0)
				.getWindowHeight().should.eventually.be.above(0);
		});
	});
});
