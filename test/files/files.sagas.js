import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import * as actions from '../../plugins/Files/js/actions/files.js'
import * as sagas from '../../plugins/Files/js/sagas/files.js'
import { expect } from 'chai'
import { spy } from 'sinon'
import proxyquire from 'proxyquire'
import { List } from 'immutable'
import Siad from 'sia.js'
import BigNumber from 'bignumber.js'
import rootReducer from '../../plugins/Files/js/reducers/index.js'
const sagaMiddleware = createSagaMiddleware()

// Stub out the helper functions used in the files sagas.
let testAvailableStorage
let testUsage
let testCost
let testUploads
let testDownloads
let testDirectoryFiles
const helperMocks = {
	'./helpers.js': {
		allowanceStorage: () => testAvailableStorage,
		totalUsage: () => testUsage,
		estimatedStoragePriceGBSC: () => testCost,
		parseUploads: () => testUploads,
		parseDownloads: () => testDownloads,
		readdirRecursive: () => testDirectoryFiles,
		'@global': true,
	}
}

const rootSaga = proxyquire('../../plugins/Files/js/sagas/index.js', helperMocks).default
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Stub the parts of the Sia API that the files plugin uses.
let contracts = []
let testFiles
let walletState
const uploadSpy = spy()
const setAllowanceSpy = spy()
const downloadSpy = spy()
const deleteSpy = spy()
const testFunds = Siad.siacoinsToHastings(100000)
const mockSiaAPI = {
	call: (uri, callback) => {
		if (uri === '/renter/contracts') {
			callback(null, { contracts })
		}
		if (uri === '/renter/files') {
			callback(null, { files: testFiles })
		}
		if (uri === '/wallet') {
			callback(null, walletState)
		}
		if (uri === '/hostdb/active') {
			callback(null, {
				hosts: [],
			})
		}
		if (uri === '/renter/downloads') {
			callback(null, {
				downloads: testDownloads,
			})
		}
		if (uri === '/renter') {
			callback(null, {
				settings: {
					allowance: {
						funds: testFunds.toString(),
					}
				}
			})
		}

		if (typeof uri === 'object') {
			if (uri.url.indexOf('/renter/delete') !== -1) {
				deleteSpy(uri.url)
				callback()
			}
			if (uri.url.indexOf('/renter/download') !== -1) {
				downloadSpy(uri.url, uri.qs.destination)
				callback()
			}
			if (uri.url.indexOf('/renter/upload') !== -1) {
				uploadSpy(uri.url)
				callback()
			}
			if (uri.url === '/renter') {
				setAllowanceSpy(uri.qs.funds, uri.qs.hosts, uri.qs.period)
				callback()
			}
		}
	},
	showError: spy(),
	siacoinsToHastings: Siad.siacoinsToHastings,
	hastingsToSiacoins: Siad.hastingsToSiacoins,
}

let store

describe('files plugin sagas', () => {
	before(() => {
		global.SiaAPI = mockSiaAPI
		store = createStore(
			rootReducer,
			applyMiddleware(sagaMiddleware)
		)
		sagaMiddleware.run(rootSaga)
	})
	afterEach(() => {
		SiaAPI.showError.reset()
	})
	it('runs every watcher saga defined in files', () => {
		expect(rootSaga().next().value).to.have.length(Object.keys(sagas).length)
	})
	it('sets contract count on getContractCount', async () => {
		const contractCount = 36
		for (let i = 0; i < contractCount; i++) {
			contracts.push('test' + i)
		}
		store.dispatch(actions.getContractCount())
		await sleep(100)
		expect(store.getState().files.get('contractCount')).to.equal(contracts.length)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets files on getFiles', async () => {
		testFiles = [
			'testfile',
			'testfile2',
			'testfile3',
			'testfile4',
		]
		store.dispatch(actions.getFiles())
		await sleep(100)
		expect(store.getState().files.get('files').size).to.equal(testFiles.length)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets wallet lock state on getWalletLockstate', async () => {
		walletState = {
			unlocked: false,
			encrypted: true,
			confirmedsiacoinbalance: Siad.siacoinsToHastings(1000).toString(),
		}
		store.dispatch(actions.getWalletLockstate())
		await sleep(100)
		expect(store.getState().wallet.get('unlocked')).to.be.false
		walletState.unlocked = true
		store.dispatch(actions.getWalletLockstate())
		await sleep(100)
		expect(store.getState().wallet.get('unlocked')).to.be.true
		expect(SiaAPI.showError.called).to.be.false
	})
	it('calls /renter/upload on uploadFile', async () => {
		uploadSpy.reset()
		store.dispatch(actions.uploadFile('testfile', ''))
		await sleep(100)
		expect(uploadSpy.calledWithExactly('/renter/upload/testfile')).to.be.true
		expect(SiaAPI.showError.called).to.be.false
	})
	it('calls /renter/upload correctly on every file in a folder on uploadFolder', async () => {
		uploadSpy.reset()
		testDirectoryFiles = List([
			'testfile5',
			'testfile6',
			'testfolder/testfile2.jpg',
			'testfolder/testfolder2/testfolder.png',
			'testfile.app.png',
		])
		store.dispatch(actions.uploadFolder('test/testsiapath', '/test/testdir'))
		await sleep(100)
		expect(SiaAPI.showError.called).to.be.false
		expect(uploadSpy.callCount).to.equal(testDirectoryFiles.size)
		let callIndex = 0
		testDirectoryFiles.forEach((file) => {
			expect(uploadSpy.getCall(callIndex).calledWithExactly('/renter/upload/test/testsiapath/' + file)).to.be.true
			callIndex++
		})
	})
	it('sets uploads on getUploads', async () => {
		testUploads = [
			'upload1',
			'upload2',
			'upload3',
		]
		store.dispatch(actions.getUploads())
		await sleep(100)
		expect(store.getState().files.get('uploading')).to.deep.equal(testUploads)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets downloads on getDownloads', async () => {
		testDownloads = [
			'upload4',
			'upload5',
			'upload6',
		]
		store.dispatch(actions.getDownloads())
		await sleep(100)
		expect(store.getState().files.get('downloading')).to.deep.equal(testDownloads)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('calls /renter/download on downloadFile', async () => {
		store.dispatch(actions.downloadFile('test/siapath', '/test/downloadpath'))
		await sleep(100)
		expect(downloadSpy.calledWithExactly('/renter/download/test/siapath', '/test/downloadpath')).to.be.true
		expect(SiaAPI.showError.called).to.be.false
	})
	it('calls /renter/delete on deleteFile', async () => {
		store.dispatch(actions.deleteFile('test/siapath'))
		await sleep(100)
		expect(deleteSpy.calledWithExactly('/renter/delete/test/siapath')).to.be.true
		expect(SiaAPI.showError.called).to.be.false
	})
	it('calls receiveStorageMetrics on getStorageMetrics', async () => {
		testUsage = '2 GB'
		testAvailableStorage = '12 GB'
		store.dispatch(actions.getStorageMetrics())
		await sleep(100)
		expect(store.getState().files.get('storageUsage')).to.equal(testUsage)
		expect(store.getState().files.get('storageAvailable')).to.equal(testAvailableStorage)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets allowance with the correct allowance on setAllowance', async () => {
		const buyAmount = '1000'
		const expectedAllowance = testFunds.add(Siad.siacoinsToHastings(buyAmount)).toString()
		const expectedPeriod = 3*4320
		const expectedHosts = 24
		store.dispatch(actions.setAllowance(buyAmount))
		await sleep(100)
		expect(setAllowanceSpy.calledWithExactly(expectedAllowance, expectedHosts, expectedPeriod)).to.be.true
		expect(store.getState().files.get('showAllowanceDialog')).to.be.false
		expect(store.getState().allowancedialog.get('settingAllowance')).to.be.false
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets storage cost and size on calculateStorageCost', async () => {
		testCost = new BigNumber('1337')
		store.dispatch(actions.calculateStorageCost('100'))
		await sleep(100)
		expect(store.getState().allowancedialog.get('storageSize')).to.equal('100')
		expect(store.getState().allowancedialog.get('storageCost')).to.equal(testCost.round(3).toString())
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets the correct wallet balance on getWalletBalance', async () => {
		store.dispatch(actions.getWalletBalance())
		await sleep(100)
		expect(store.getState().wallet.get('balance')).to.equal(Siad.hastingsToSiacoins(walletState.confirmedsiacoinbalance).round(2).toString())
		expect(SiaAPI.showError.called).to.be.false
	})
})
