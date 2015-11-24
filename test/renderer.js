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

	// Helper used to ensure a specific plugin is loaded
	function pluginLoaded(pluginName) {
		return client.execute(function(name) {
			return Plugins[name].isLoading();
		}, pluginName).then(function(isLoading) {
			return isLoading;
		});
	}

	// Clicks all sidebar icons and ensures navigation
	it('navigates correctly', function() {
		return client
			.waitForExist('.current')
			.waitUntil(function() {
				return pluginLoaded('About');
			})
			.click('#About-button')
			.waitForExist('#About-button.current')
			.waitUntil(function() {
				return pluginLoaded('Wallet');
			})
			.click('#Wallet-button')
			.waitForExist('#Wallet-button.current')
			.waitUntil(function() {
				return pluginLoaded('Hosting');
			})
			.click('#Hosting-button')
			.waitForExist('#Hosting-button.current')
			.waitUntil(function() {
				return pluginLoaded('Files');
			})
			.click('#Files-button')
			.waitForExist('#Files-button.current')
			.waitUntil(function() {
				return pluginLoaded('Overview');
			})
			.click('#Overview-button')
			.waitForExist('#Overview-button.current');
	});

	// Test basic startup properties
	describe('wallet plugin', function() {
		// Used to fake out addresses being sent and rendered by the wallet Plugin
		function addNAddresses(n, callback) {
			var randomAddresses = [];

			// script to execute in the UI
			function script(addresses) {
				function sendAddresses() {
					Plugins.Wallet.sendToView('update-addresses', null, {
						addresses: addresses,
					});
				}
				if (Plugins.Wallet.isLoading()) {
					Plugins.Wallet.on("did-finish-load", sendAddresses);
				} else {
					sendAddresses();
				}
			}

			// push this random address onto the array
			function pushAddress(ex, buf) {
				randomAddresses.push({
					address: buf.toString('hex'),
				});
				if (randomAddresses.length === n) {
					client.execute(script, randomAddresses).then(function() {
						callback();
					});
				}
			}

			// Generate the random addresses and send them to the Wallet plugin
			// in an array
			for (var i = 0; i < n; i++) {
				Crypto.randomBytes(38, pushAddress);
			}
		}
		it('appends 10000 addresses', function(done) {
			addNAddresses(10000, done);
		});
	});
});
