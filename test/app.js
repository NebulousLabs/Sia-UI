import { Application } from 'spectron'
import { expect } from 'chai'
import psTree from 'ps-tree'
import * as Siad from 'sia.js'


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
			if (child.COMMAND === 'siad') {
				resolve({exists: true, pid: child.PID})
			}
		})
		resolve({exists: false})
	})
})

// pkillSiad kills all siad processes running on the machine, used in these
// tests to ensure a clean env
const pkillSiad = () => new Promise((resolve, reject) => {
	psTree(0, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMMAND === 'siad') {
				process.kill(child.PID, 'SIGKILL')
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

// we need functions for mocha's `this` for setting timeouts.
/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-expressions */
describe('startup and shutdown behaviour', () => {
	after(async () => {
		// never leave a dangling siad
		await pkillSiad()
	})
	describe('with no siad currently running', function() {
		this.timeout(120000)
		let app
		before(async () => {
			await pkillSiad()
			app = new Application({
				path: './node_modules/electron-prebuilt/dist/electron',
				args: [
					'.',
				],
			})
			return app.start()
		})
		after(() => {
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
		})
		it('starts siad and loads correctly on launch', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.getText('#overlay-text') !== 'Welcome to Sia') {
				await sleep(200)
			}
			const siadProcess = await getSiadChild(pid)
			expect(siadProcess.exists).to.be.true
		})
		it('gracefully exits siad on quit', async () => {
			const pid = await app.mainProcess.pid()
			const siadProcess = await getSiadChild(pid)
			expect(siadProcess.exists).to.be.true
			app.webContents.send('quit')
			while (await app.client.getText('#overlay-text') !== 'Quitting Sia...') {
				await sleep(200)
			}
			while (isProcessRunning(pid)) {
				await sleep(200)
			}
			expect(isProcessRunning(siadProcess.pid)).to.be.false
		})
	})
	describe('with a siad running on start', function() {
		this.timeout(120000)
		let app
		let siadProcess
		before(async () => {
			await pkillSiad()
			siadProcess = Siad.launch('siad')
			app = new Application({
				path: './node_modules/electron-prebuilt/dist/electron',
				args: [
					'.',
				],
			})
			return app.start()
		})
		after(async () => {
			await pkillSiad()
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
		})
		it('connects and loads correctly to the running siad', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.getText('#overlay-text') !== 'Welcome back') {
				await sleep(200)
			}
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
