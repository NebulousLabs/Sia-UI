import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import * as actions from '../../plugins/Files/js/actions/files.js'
import * as sagas from '../../plugins/Files/js/sagas/files.js'
import { expect } from 'chai'
import { spy } from 'sinon'

import rootSaga from '../../plugins/Files/js/sagas/index.js'
import rootReducer from '../../plugins/Files/js/reducers/index.js'

const sagaMiddleware = createSagaMiddleware()

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let contracts = []
const mockSiaAPI = {
	call: (uri, callback) => {
		if (uri === '/renter/contracts') {
			callback(null, { contracts })
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
})
