'use strict';

// Libraries required for testing
const Application = require('spectron').Application;
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const Path = require('path');
const Crypto = require('crypto');

// Chai's should syntax is executed to edit Object to have Object.should
var should = Chai.should();
// Chai's should syntax is extended to deal well with Promises
Chai.use(ChaiAsPromised);

// The one app that this suite is testing is Sia-UI
describe('renderer process', function() {
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
	describe('wallet plugin', function() {
		function appendNAddresses(n, callback) {
			var appended = 0;
			function appendScript(hex) {
				Plugins.Wallet.execute('appendAddress(\'' + hex + '\');');
			}
			function incrementCounter(ret) {
				if (++appended === n) {
					callback();
				}
			}
			function injectAppendScript(ex, buf) {
				client.execute(appendScript, buf.toString('hex')).then(incrementCounter);
			}
			function appendRandAddress() {
				Crypto.randomBytes(38, injectAppendScript);       //async
			}
			for (var i = 0; i < n; i++) {
				appendRandAddress();
			}
		}
		it('wait until loaded', function() {
			return client.waitUntilWindowLoaded();
		});
		it('appends 1 transactions', function(done) {
			appendNAddresses(1, done);
		});
		it('appends 100 transactions', function(done) {
			appendNAddresses(100, done);
		});
		// it('appends 10000 transactions', function(done) {
		// 	appendNAddresses(10000, done);
		// });
	});
});
