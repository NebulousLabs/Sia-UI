import { expect } from 'chai'
import { spy, stub, match } from 'sinon'
import { mount } from 'enzyme'
import { initWallet } from '../plugins/Wallet/js/main.js'
import * as Siad from 'sia.js'
import siaConfig from '../js/mainjs/config.js'

const mockSiaAPI = {
	call: stub(),
	config: siaConfig(''),
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
	openFile: () => spy(),
	saveFile: () => spy(),
	showMessage: () => spy(),
	showError: () => spy(),
}

const testSeed = 'this is a seed used for testing env'

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
const setMockAddresses = (addresses) => {
	SiaAPI.call.withArgs('/wallet/addresses').callsArgWith(1, null, {
		addresses: addresses,
	})
}

const mockSendSiacoin = () => {
	SiaAPI.call.withArgs(match.has('url', '/wallet/siacoins')).callsArgWith(1, null)
}
const mockCreateWallet = (primaryseed) => {
	SiaAPI.call.withArgs(match.has('url', '/wallet/init')).callsArgWith(1, null, {primaryseed: primaryseed})
}
const mockChangePassword = (password, wrongpassword) => {
	SiaAPI.call.withArgs(match((call) => callHasPassword(call, password))).callsArgWith(1, null)
	SiaAPI.call.withArgs(match((call) => callHasPassword(call, wrongpassword))).callsArgWith(1,  {message: 'incorrect password'})
}

// Set up default siad call mocks for the wallet.
// Currently, wallet lock state, login, and send siacoin calls are mocked.
const setupMockCalls = () => {
	SiaAPI.call.withArgs(match({
		url: '/wallet/lock',
		method: 'POST',
	})).callsArgWith(1, null)
	SiaAPI.call.withArgs('/wallet/seeds').callsArgWith(1, null, { 'primaryseed': testSeed })
	setMockLockState({unlocked: false, encrypted: true})
	setMockWalletPassword('testpass')
	setMockIncorrectWalletPassword('wrongpass')
	mockSendSiacoin()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('wallet change password functionality', () => {
	let walletComponent
	before(() => {
		global.SiaAPI = mockSiaAPI
		// Set NODE_ENV to production to suppress react warnings
		// caused by externally triggering events on mounted components
		process.env.NODE_ENV = 'production'
		setMockLockState({unlocked: true, encrypted: true, rescanning: false})
		mockChangePassword('correctpass', 'wrongpass')
		walletComponent = mount(initWallet())
	})
	it('renders a changepasswordbutton', async () => {
		await sleep(50)
		expect(walletComponent.find('ChangePasswordButton')).to.have.length(1)
	})
	it('shows a changepassworddialog when changepasswordbutton is clicked', async () => {
		walletComponent.find('.change-password-button').first().simulate('click')
		await sleep(10)
		expect(walletComponent.find('ChangePasswordDialog')).to.have.length(1)
	})
	it('shows an error if the two new passwords do not match', async () => {
		const changePasswordForm = walletComponent.find('.change-password-form').first()
		const currentPasswordInput = changePasswordForm.find('.currentpassword-input')
		currentPasswordInput.node.value = 'oldpassword'
		const newPasswordInput = changePasswordForm.find('.newpassword-input')
		newPasswordInput.node.value = 'test'
		const newPasswordInputAgain = changePasswordForm.find('.newpassword-again-input')
		newPasswordInputAgain.node.value = 'test-different'
		changePasswordForm.simulate('submit', { target: { currentpassword: currentPasswordInput.node, newpassword: newPasswordInput.node, 'newpassword-again': newPasswordInputAgain.node } })
		await sleep(10)
		expect(changePasswordForm.find('.change-password-error').first().text()).to.equal('passwords did not match!')
	})
	it('shows an error if the current password is incorrect', async () => {
		const changePasswordForm = walletComponent.find('.change-password-form').first()
		const currentPasswordInput = changePasswordForm.find('.currentpassword-input')
		currentPasswordInput.node.value = 'wrongpass'
		const newPasswordInput = changePasswordForm.find('.newpassword-input')
		newPasswordInput.node.value = 'test'
		const newPasswordInputAgain = changePasswordForm.find('.newpassword-again-input')
		newPasswordInputAgain.node.value = 'test'
		changePasswordForm.simulate('submit', { target: { currentpassword: currentPasswordInput.node, newpassword: newPasswordInput.node, 'newpassword-again': newPasswordInputAgain.node } })
		await sleep(10)
		expect(changePasswordForm.find('.change-password-error').first().text()).to.equal('incorrect password')
	})
	it('successfully changes wallet password using correct password', async () => {
		const changePasswordForm = walletComponent.find('.change-password-form').first()
		const currentPasswordInput = changePasswordForm.find('.currentpassword-input')
		currentPasswordInput.node.value = 'correctpass'
		const newPasswordInput = changePasswordForm.find('.newpassword-input')
		newPasswordInput.node.value = 'test'
		const newPasswordInputAgain = changePasswordForm.find('.newpassword-again-input')
		newPasswordInputAgain.node.value = 'test'
		changePasswordForm.simulate('submit', { target: { currentpassword: currentPasswordInput.node, newpassword: newPasswordInput.node, 'newpassword-again': newPasswordInputAgain.node } })
		await sleep(10)
		expect(changePasswordForm.find('.change-password-error').first().text()).to.equal('password changed successfully.')
	})
	it('hides when cancel is clicked', async () => {
		walletComponent.find('.change-password-cancel').first().simulate('click')
		await sleep(10)
		expect(walletComponent.find('ChangePasswordDialog')).to.have.length(0)
	})
	it('clears the error field when reopened', async () => {
		walletComponent.find('.change-password-button').first().simulate('click')
		await sleep(10)
		expect(walletComponent.find('ChangePasswordDialog')).to.have.length(1)
		expect(walletComponent.find('.change-password-error').first().text()).to.equal('')
	})
})

describe('wallet creation', () => {
	before(() => {
		global.SiaAPI = mockSiaAPI
		// Set NODE_ENV to production to suppress react warnings
		// caused by externally triggering events on mounted components
		process.env.NODE_ENV = 'production'
		setMockLockState({unlocked: false, encrypted: false, rescanning: false})
	})

	describe('create wallet using custom password', () => {
		let walletComponent
		before(() => {
			mockCreateWallet('testseed')
			walletComponent = mount(initWallet())
		})
		it('shows an uninitialized wallet dialog initially', async () => {
			await sleep(50)
			expect(walletComponent.find('UninitializedWalletDialog')).to.have.length(1)
		})
		it('shows a newwalletform when custom passphrase is enabled', async () => {
			walletComponent.find('.use-passphrase-checkbox').children().first().simulate('change')
			await sleep(10)
			walletComponent.find('.create-wallet-button').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('NewWalletForm')).to.have.length(1)
		})
		it('creates a wallet correctly using newwalletform', async () => {
			const passwordInput = walletComponent.find('.new-wallet-form input').first()
			passwordInput.node.value = 'testpass'
			walletComponent.find('.new-wallet-form-buttons').first().simulate('submit', { target: { password: passwordInput.node }})
			await sleep(20)
			expect(walletComponent.find('NewWalletForm')).to.have.length(0)
		})
		it('shows a newwalletdialog with the custom password', async () => {
			expect(walletComponent.find('NewWalletDialog')).to.have.length(1)
			expect(walletComponent.find('.newwallet-seed').text()).to.equal('testseed')
			expect(walletComponent.find('.newwallet-password').text()).to.equal('testpass')
		})
		it('shows a confirmation dialog when NewWalletDialog is dismissed', async () => {
			walletComponent.find('.newwallet-dismiss').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('ConfirmationDialog')).to.have.length(1)
		})
		it('shows an error if user confirms the wrong seed', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'badseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'testpass'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('.seed-confirmation-error').first().text()).to.equal('seed did not match!')
		})
		it('shows an error if user confirms the wrong password', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'testseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'badpass'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('.seed-confirmation-error').first().text()).to.equal('password did not match!')
		})
		it('dismisses confirmation dialog when correct seed and password is entered', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'testseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'testpass'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('ConfirmationDialog')).to.have.length(0)
			expect(walletComponent.find('NewWalletDialog')).to.have.length(0)
			expect(walletComponent.find('LockScreen')).to.have.length(1)
		})
	})

	describe('create wallet using no custom password', () => {
		let walletComponent
		before(() => {
			mockCreateWallet('testseed')
			walletComponent = mount(initWallet())
		})
		it('shows an uninitialized wallet dialog initially', async () => {
			await sleep(50)
			expect(walletComponent.find('UninitializedWalletDialog')).to.have.length(1)
		})
		it('creates a new wallet and shows the seed', async () => {
			walletComponent.find('.create-wallet-button').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('NewWalletDialog')).to.have.length(1)
			expect(walletComponent.find('.newwallet-seed').text()).to.equal('testseed')
			expect(walletComponent.find('.newwallet-password').text()).to.equal('testseed')
		})
		it('shows a confirmation dialog when NewWalletDialog is dismissed', async () => {
			walletComponent.find('.newwallet-dismiss').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('ConfirmationDialog')).to.have.length(1)
		})
		// ugly hacks because enzyme doesnt support event propogation or testing
		// forms... wtf
		it('shows an error if user confirms the wrong seed', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'badseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'testpass'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('.seed-confirmation-error').first().text()).to.equal('seed did not match!')
		})
		it('shows an error if user confirms the wrong password', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'testseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'badpass'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('.seed-confirmation-error').first().text()).to.equal('password did not match!')
		})
		it('dismisses confirmation dialog when correct seed is entered', async () => {
			const seedInput = walletComponent.find('.seed-confirmation-input').first()
			seedInput.node.value = 'testseed'
			const pwInput = walletComponent.find('.password-confirmation-input').first()
			pwInput.node.value = 'testseed'
			walletComponent.find('.seed-confirmation-button').simulate('submit', { target: { seed: seedInput.node, password: pwInput.node }})
			await sleep(10)
			expect(walletComponent.find('ConfirmationDialog')).to.have.length(0)
			expect(walletComponent.find('NewWalletDialog')).to.have.length(0)
			expect(walletComponent.find('LockScreen')).to.have.length(1)
		})
	})
})

describe('wallet plugin integration tests', () => {
	let walletComponent
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
		expect(walletComponent.find('.unlock-status').first().text()).to.contain('Unlocking')
		const poll = setInterval(() => {
			if (walletComponent.find('.lockscreen').length === 0) {
				clearInterval(poll)
				done()
			}
		}, 100)
	})

	describe('receive prompt', () => {
		it('shows a new wallet address when receive siacoins is clicked initially', async () => {
			setMockReceiveAddress('testaddress')
			setMockAddresses(['testaddress'])
			expect(walletComponent.find('.receive-prompt')).to.have.length(0)
			walletComponent.find('.receive-button').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('.receive-prompt')).to.have.length(1)
			expect(walletComponent.find('.receive-address').props().value).to.equal('testaddress')
			expect(walletComponent.find('.prior-address')).to.have.length(0)
		})
		it('saves the address given a description', async () => {
			walletComponent.find('.address-description').simulate('change', { target: { value: 'testdesc' } })
			await sleep(10)
			walletComponent.find('.save-address-button').simulate('click')
			await sleep(10)
			expect(walletComponent.find('.prior-address')).to.have.length(1)
		})
		it('updates the description if a duplicate address is saved', async() => {
			walletComponent.find('.address-description').simulate('change', { target: { value: 'testdesc-updated' } })
			await sleep(10)
			walletComponent.find('.save-address-button').simulate('click')
			await sleep(10)
			expect(walletComponent.find('.prior-address')).to.have.length(1)
			expect(walletComponent.find('.description').first().text()).to.equal('testdesc-updated')
		})
		it('generates a new address when New is clicked', async () => {
			setMockReceiveAddress('testaddress2')
			setMockAddresses(['testaddress', 'testaddress2'])
			walletComponent.find('.new-address-button').simulate('click')
			await sleep(10)
			expect(walletComponent.find('.receive-address').props().value).to.equal('testaddress2')
			expect(walletComponent.find('.prior-address')).to.have.length(1)
		})
		it('doesnt display addresses the node does not have', async() => {
			// set our mock node's receiving addresses to empty, simulating the case
			// where Sia-UI has a bunch of saved addresses which the node has no
			// recolletion of. Sia-UI should not render any of the saved receiving
			// addresses.
			setMockAddresses([])
			walletComponent.find('.done-button').simulate('click')
			await sleep(10)
			walletComponent.find('.receive-button').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('.prior-address')).to.have.length(0)
		})
	})

	describe('wallet send prompt', () => {
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

	})

	describe('wallet backup button', () => {
		it('shows the primary seed when the backup wallet button is clicked', async () => {
			walletComponent.find('.backup-button').simulate('click')
			await sleep(10)
			expect(walletComponent.find('.backupprompt')).to.have.length(1)
			expect(walletComponent.find('.primary-seed')).to.have.length(1)
			expect(walletComponent.find('.primary-seed').first().text()).to.equal(testSeed)
		})
		it('hides when ok button is clicked', async () => {
			walletComponent.find('.backupprompt > .ok-button').first().simulate('click')
			await sleep(10)
			expect(walletComponent.find('.backupprompt')).to.have.length(0)
		})
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

