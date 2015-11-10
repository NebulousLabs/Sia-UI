var Application = require('spectron').Application;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.should();
chai.use(chaiAsPromised);

describe('Sia-UI', function () {
	var app;
	var client;
	beforeEach(function () {
		app = new Application({
			path: path.join(__dirname, '../node_modules/.bin/electron'),
			args: ['--app=' + path.join(__dirname, '..')],
		});
		return app.start();
	});

	beforeEach(function () {
		client = app.client;
		chaiAsPromised.transferPromiseness = client.transferPromiseness;
	});

	afterEach(function () {
		if (app && app.isRunning()) {
			return app.stop();
		}
	});

	describe('on startup', function () {
		it('opens Sia-UI properly', function () {
			return client.waitUntilWindowLoaded()
				.getWindowCount().should.eventually.equal(1)
				.isWindowMinimized().should.eventually.be.false
				.isWindowDevToolsOpened().should.eventually.be.false
				.isWindowVisible().should.eventually.be.true
				.isWindowFocused().should.eventually.be.true
				.getWindowWidth().should.eventually.be.above(0)
				.getWindowHeight().should.eventually.be.above(0)
				.getArgv().then(function(argv) {
					argv[0].should.contain('electron')
					argv[1].should.contain('Sia-UI')
				});
		});
	});
});
