/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import RescanDialog from '../../plugins/Wallet/js/components/rescandialog.js'
import LockScreen from '../../plugins/Wallet/js/components/lockscreen.js'
import PasswordPrompt from '../../plugins/Wallet/js/containers/passwordprompt.js'
import UninitializedWalletDialog from '../../plugins/Wallet/js/containers/uninitializedwalletdialog.js'

const lockedEncryptedScreen = shallow(<LockScreen unlocked={false} encrypted unlocking={false} rescanning={false} />)
const lockedUnencryptedScreen = shallow(<LockScreen unlocked={false} encrypted={false} unlocking={false} rescanning={false} />)
const unlockedEncryptedScreen = shallow(<LockScreen unlocked encrypted unlocking={false} rescanning={false} />)
describe('wallet lock screen component', () => {
	it('renders an empty div if the wallet is unlocked and encrypted and not unlocking', () => {
		expect(unlockedEncryptedScreen.equals(<div />)).to.be.true
	})
	it('renders a password prompt modal if wallet is encrypted and not unlocked or unlocking', () => {
		expect(lockedEncryptedScreen.contains(<PasswordPrompt />)).to.be.true
	})
	it('renders a new wallet button if the wallet is locked but not encrypted or unlocking', () => {
		expect(lockedUnencryptedScreen.contains(<UninitializedWalletDialog />)).to.be.true
	})
	it('renders a passwordprompt if the wallet is unlocking', () => {
		expect(shallow(<LockScreen unlocked={false} encrypted unlocking={true} rescanning={false} />).contains(<PasswordPrompt />)).to.be.true
	})
	it('renders a rescandialog if the wallet is rescanning', () => {
		expect(shallow(<LockScreen unlocked={false} encrypted unlocking={false} rescanning />).contains(<RescanDialog />)).to.be.true
		expect(shallow(<LockScreen unlocked={false} encrypted unlocking={false} rescanning />).contains(<PasswordPrompt />)).to.be.false
		expect(shallow(<LockScreen unlocked={false} encrypted unlocking={false} rescanning />).contains(<UninitializedWalletDialog />)).to.be.false
	})
})
/* eslint-enable no-unused-expressions */
