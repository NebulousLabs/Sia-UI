import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import * as actions from '../../plugins/Files/js/actions/files.js'
import * as sagas from '../../plugins/Files/js/sagas/files.js'
import { expect } from 'chai'
import { spy } from 'sinon'
import proxyquire from 'proxyquire'

const testAvailableStorage = '12 GB'
const testUsage = '2 GB'

const helperMocks = {
	'./helpers.js': {
		allowanceStorage: () => testAvailableStorage,
		totalUsage: () => testUsage,
		'@global': true,
	}
}

const rootSaga = proxyquire('../../plugins/Files/js/sagas/index.js', helperMocks).default
import rootReducer from '../../plugins/Files/js/reducers/index.js'

const sagaMiddleware = createSagaMiddleware()

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let contracts = []
let files = [
	'testfile',
	'testfile2',
	'testfile3',
	'testfile4',
]
const walletState = {
	unlocked: false,
	encrypted: true,
}
const uploadSpy = spy()
const mockSiaAPI = {
	call: (uri, callback) => {
		if (uri === '/renter/contracts') {
			callback(null, { contracts })
		}
		if (uri === '/renter/files') {
			callback(null, { files })
		}
		if (uri === '/wallet') {
			callback(null, walletState)
		}
		if (uri === '/hostdb/active') {
			callback(null, {
				hosts: [],
			})
		}
		if (uri === '/renter') {
			callback(null, {
				settings: {
					allowance: {
						funds: 0,
					}
				}
			})
		}
		if (typeof uri === 'object') {
			if (uri.url.indexOf('/renter/upload') !== -1) {
				uploadSpy(uri.url)
			}
		}
	},
	showError: spy(),
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
	it('runs every watcher saga defined in files', () => {
		expect(rootSaga().next().value).to.have.length(Object.keys(sagas).length)
	})
	afterEach(() => {
		SiaAPI.showError.reset()
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
		store.dispatch(actions.getFiles())
		await sleep(100)
		expect(store.getState().files.get('files').size).to.equal(files.length)
		expect(SiaAPI.showError.called).to.be.false
	})
	it('sets wallet lock state on getWalletLockstate', async () => {
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
	it('calls receiveStorageMetrics on getStorageMetrics', async () => {
		store.dispatch(actions.getStorageMetrics())
		await sleep(100)
		expect(store.getState().files.get('storageUsage')).to.equal(testUsage)
		expect(store.getState().files.get('storageAvailable')).to.equal(testAvailableStorage)
		expect(SiaAPI.showError.called).to.be.false
	})
})
