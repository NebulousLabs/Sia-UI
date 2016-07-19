import { expect } from 'chai'
import { spy, stub, match } from 'sinon'
import { mount } from 'enzyme'
import { initWallet } from '../plugins/Wallet/js/main.js'
import * as Siad from 'sia.js'

let walletComponent

const mockSiaAPI = {
	call: stub(),
	config: {},
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
	openFile: () => spy(),
	saveFile: () => spy(),
	showMessage: () => spy(),
	showError: () => spy(),
}

const setMockLockState = (lockstate) => {
	SiaAPI.call.withArgs('/wallet').callsArgWith(1, null, lockstate)
}

// This is a sinon matcher function used to set up separate mocks for
// calls to /wallet/unlock with different `encryptionpassword`s
const callHasPassword = (call, password) => {
	if (typeof call.qs === 'undefined') {
		return false
	}
	if (typeof call.qs.encryptionpassword === 'undefined') {
		return false
	}
	return call.qs.encryptionpassword === password
}

const setMockWalletPassword = (password) => {
	SiaAPI.call.withArgs(match((call) => callHasPassword(call, password))).callsArgWith(1, null)
}

const setMockIncorrectWalletPassword = (password) => {
	SiaAPI.call.withArgs(match((call) => callHasPassword(call, password))).callsArgWith(1, {message: 'incorrect password'})
}

const setMockReceiveAddress = (address) => {
	SiaAPI.call.withArgs('/wallet/address').callsArgWith(1, null, {
		address,
	})
}
const mockSendSiacoin = () => {
	SiaAPI.call.withArgs(match.has('url', '/wallet/siacoins')).callsArgWith(1, null)
}

// Set up default siad call mocks for the wallet.
// Currently, wallet lock state, login, and send siacoin calls are mocked.
const setupMockCalls = () => {
	SiaAPI.call.withArgs(match({
		url: '/wallet/lock',
		method: 'POST',
	})).callsArgWith(1, null)
	setMockLockState({unlocked: false, encrypted: true})
	setMockWalletPassword('testpass')
	setMockIncorrectWalletPassword('wrongpass')
	mockSendSiacoin()
}

describe('wallet plugin integration tests', () => {
	before(() => {
		global.SiaAPI = mockSiaAPI
		// Set NODE_ENV to production to suppress react warnings
		// caused by externally triggering events on mounted components
		process.env.NODE_ENV = 'production'
		setupMockCalls()
		walletComponent = mount(initWallet())
	})
	it('shows a lockscreen if wallet is initially locked', () => {
		expect(walletComponent.find('.lockscreen')).to.have.length(1)
	})
	it('shows an error when unlocking with an incorrect password', (done) => {
		walletComponent.find('PasswordPrompt').find('.password-input').simulate('change', {target: {value: 'wrongpass'}})
		walletComponent.find('PasswordPrompt').find('.unlock-button').simulate('click')
		const poll = setInterval(() => {
			if (walletComponent.find('.lockscreen').length > 0) {
				expect(walletComponent.find('.password-prompt-error').first().text()).to.contain('incorrect password')
				clearInterval(poll)
				done()
			}
		})
	})
	it('unlocks given the correct password', (done) => {
		walletComponent.find('PasswordPrompt').find('.password-input').simulate('change', {target: {value: 'testpass'}})
		walletComponent.find('PasswordPrompt').find('.unlock-button').simulate('click')
		expect(walletComponent.find('.lockscreen').first().text()).to.contain('Unlocking')
		const poll = setInterval(() => {
			if (walletComponent.find('.lockscreen').length === 0) {
				clearInterval(poll)
				done()
			}
		}, 100)
	})
	it('shows a new wallet address when receive siacoins is clicked', (done) => {
		setMockReceiveAddress('testaddress')
		expect(walletComponent.find('.receive-prompt')).to.have.length(0)
		walletComponent.find('.receive-button').first().simulate('click')
		const poll = setInterval(() => {
			if (walletComponent.find('.receive-prompt').length === 1) {
				expect(walletComponent.find('.wallet-address').first().text()).to.equal('testaddress')
				walletComponent.find('.receive-prompt button').simulate('click')
				done()
				clearInterval(poll)
			}
		}, 100)
	})
	it('shows a send prompt when send button is clicked', () => {
		expect(walletComponent.find('.sendprompt')).to.have.length(0)
		walletComponent.find('.send-button').first().simulate('click')
		expect(walletComponent.find('.sendprompt')).to.have.length(1)
	})
	it('sends the correct amount of siacoins to the correct address', () => {
		walletComponent.find('.sendamount input').simulate('change', { target: { value: '100' }})
		walletComponent.find('.sendaddress input').simulate('change', { target: { value: 'testaddress'}})
		walletComponent.find('.send-siacoin-button').simulate('click')
		expect(SiaAPI.call.lastCall.args[0]).to.deep.equal({
			url: '/wallet/siacoins',
			method: 'POST',
			qs: {
				destination: 'testaddress',
				amount: SiaAPI.siacoinsToHastings('100').toString(),
			},
		})
	})
	it('closes the send prompt after sending', (done) => {
		const poll = setInterval(() => {
			if (walletComponent.find('.sendprompt').length === 0) {
				clearInterval(poll)
				done()
			}
		})
	})
	it('clears send amount and address after sending', (done) => {
		walletComponent.find('.send-button').first().simulate('click')
		const poll = setInterval(() => {
			if (walletComponent.find('.sendamount input').length > 0) {
				expect(walletComponent.find('.sendamount input').props().value).to.equal('')
				expect(walletComponent.find('.sendaddress input').props().value).to.equal('')
				walletComponent.find('.cancel-send-button').simulate('click')
				clearInterval(poll)
				done()
			}
		}, 50)
	})
	it('locks when the lock button is clicked', (done) => {
		expect(walletComponent.find('.lockscreen')).to.have.length(0)
		walletComponent.find('.lock-button').simulate('click')
		const poll = setInterval(() => {
			if (walletComponent.find('.lockscreen').length === 1) {
				clearInterval(poll)
				done()
			}
		}, 100)
	})
})
