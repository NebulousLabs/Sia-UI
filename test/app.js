import { Application } from 'spectron'
import { spawn } from 'child_process'
import { expect } from 'chai'
import psTree from 'ps-tree'
import * as Siad from 'sia.js'
import fs from 'fs'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// getSiadChild takes an input pid and looks at all the child process of that
// pid, returning an object with the fields {exists, pid}, where exists is true
// if the input pid has a 'siad' child, and the pid is the process id of the
// child.
const getSiadChild = (pid) => new Promise((resolve, reject) => {
	psTree(pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMMAND === 'siad' || child.COMMAND === 'siad.exe') {
				resolve({exists: true, pid: child.PID})
			}
		})
		resolve({exists: false})
	})
})

// pkillSiad kills all siad processes running on the machine, used in these
// tests to ensure a clean env
const pkillSiad = () => new Promise((resolve, reject) => {
	psTree(process.pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMMAND === 'siad' || child.COMMAND === 'siad.exe') {
				if (process.platform === 'win32') {
					spawn('taskkill', ['/pid', child.PID, '/f', '/t'])
				} else {
					process.kill(child.PID, 'SIGKILL')
				}
			}
		})
		resolve()
	})
})

// isProcessRunning leverages the semantics of `process.kill` to return true if
// the input pid is a running process.  If process.kill is initiated with the
// signal set to '0', no signal is sent, but error checking is still performed.
const isProcessRunning = (pid) => {
	try {
		process.kill(pid, 0)
		return true
	} catch (e) {
		return false
	}
}

const electronBinary = process.platform === 'win32' ? 'node_modules\\electron\\dist\\electron.exe' : './node_modules/electron/dist/electron'

// we need functions for mocha's `this` for setting timeouts.
/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-expressions */
describe('startup and shutdown behaviour', () => {
	after(async () => {
		// never leave a dangling siad
		await pkillSiad()
	})
	describe('window closing behaviour', function() {
		this.timeout(200000)
		let app
		let siadProcess
		beforeEach(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		afterEach(async () => {
			try {
				await pkillSiad()
				while (isProcessRunning(siadProcess.pid)) {
					await sleep(10)
				}
				app.webContents.send('quit')
				await app.stop()

			} catch (e) {
			}
		})
		it('hides the window and persists in tray if closeToTray = true', async () => {
			const pid = await app.mainProcess.pid()
			siadProcess = await getSiadChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(siadProcess.pid)).to.be.true
		})
		it('quits gracefully on close if closeToTray = false', async () => {
			app.webContents.executeJavaScript('window.closeToTray = false')
			const pid = await app.mainProcess.pid()
			expect(siadProcess.exists).to.be.true

			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(siadProcess.pid)).to.be.false
		})
		it('quits gracefully on close if already minimized and closed again', async () => {
			const pid = await app.mainProcess.pid()
			siadProcess = await getSiadChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(siadProcess.pid)).to.be.true
			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(siadProcess.pid)).to.be.false
		})
	})
	describe('startup with no siad currently running', function() {
		this.timeout(120000)
		let app
		let siadProcess
		before(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillSiad()
			while (isProcessRunning(siadProcess.pid)) {
				await sleep(10)
			}
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
		})
		it('starts siad and loads correctly on launch', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			siadProcess = await getSiadChild(pid)
			expect(siadProcess.exists).to.be.true
		})
		it('gracefully exits siad on quit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (await app.client.isVisible('#overlay-text') === false) {
				await sleep(10)
			}
			while (await app.client.getText('#overlay-text') !== 'Quitting Sia...') {
				await sleep(10)
			}
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(siadProcess.pid)).to.be.false
		})
	})
	describe('startup with a siad already running', function() {
		this.timeout(120000)
		let app
		let siadProcess
		before(async () => {
			if (!fs.existsSync('sia-testing')) {
				fs.mkdirSync('sia-testing')
			}
			siadProcess = Siad.launch(process.platform === 'win32' ? 'Sia\\siad.exe' : './Sia/siad', {
				'sia-directory': 'sia-testing',
			})
			while (await Siad.isRunning('localhost:9980') === false) {
				await sleep(10)
			}
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillSiad()
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
			while (isProcessRunning(siadProcess.pid)) {
				await sleep(10)
			}
		})
		it('connects and loads correctly to the running siad', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			const childSiad = await getSiadChild(pid)
			expect(childSiad.exists).to.be.false
		})
		it('doesnt quit siad on exit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (isProcessRunning(pid)) {
				await sleep(200)
			}
			expect(isProcessRunning(siadProcess.pid)).to.be.true
			siadProcess.kill('SIGKILL')
		})
	})
})

/* eslint-enable no-invalid-this */
/* eslint-enable no-unused-expressions */
