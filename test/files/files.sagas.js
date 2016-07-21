import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import * as actions from '../../plugins/Files/js/actions/files.js'
import * as sagas from '../../plugins/Files/js/sagas/files.js'
import { expect } from 'chai'
import { spy } from 'sinon'
import proxyquire from 'proxyquire'
import Siad from 'sia.js'
import BigNumber from 'bignumber.js'

const testAvailableStorage = '12 GB'
const testUsage = '2 GB'
const testCost = new BigNumber('1337')

const helperMocks = {
	'./helpers.js': {
		allowanceStorage: () => testAvailableStorage,
		totalUsage: () => testUsage,
		estimatedStoragePriceGBSC: () => testCost,
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
const setAllowanceSpy = spy()
const testFunds = Siad.siacoinsToHastings(100000)
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
						funds: testFunds.toString(),
					}
				}
			})
		}

		if (typeof uri === 'object') {
			if (uri.url.indexOf('/renter/upload') !== -1) {
				uploadSpy(uri.url)
				callback(null)
			}
			if (uri.url === '/renter') {
				setAllowanceSpy(uri.qs.funds, uri.qs.hosts, uri.qs.period)
				callback(null)
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
		store.dispatch(actions.calculateStorageCost('100'))
		await sleep(100)
		expect(store.getState().allowancedialog.get('storageSize')).to.equal('100')
		expect(store.getState().allowancedialog.get('storageCost')).to.equal(testCost.round(3).toString())
		expect(SiaAPI.showError.called).to.be.false
	})
})
