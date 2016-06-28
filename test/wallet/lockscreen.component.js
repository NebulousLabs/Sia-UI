import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import LockScreen from '../../plugins/Wallet/js/components/lockscreen.js'
import PasswordPrompt from '../../plugins/Wallet/js/containers/passwordprompt.js'
import NewWalletButton from '../../plugins/Wallet/js/containers/newwalletbutton.js'

const lockedEncryptedScreen = shallow(<LockScreen unlocked={false} encrypted={true} unlocking={false} />)
const lockedUnencryptedScreen = shallow(<LockScreen unlocked={false} encrypted={false} unlocking={false} />)
const unlockedEncryptedScreen = shallow(<LockScreen unlocked={true} encrypted={true} unlocking={false} />)
const lockedEncryptedUnlockingScreen = shallow(<LockScreen unlocked={false} encrypted={true} unlocking={true} />)

describe('wallet lock screen component', () => {
	it('renders an empty div if the wallet is unlocked and encrypted and not unlocking', () => {
		expect(unlockedEncryptedScreen.equals(<div></div>)).to.be.true
	})
	it('renders a password prompt modal if wallet is encrypted and not unlocked or unlocking', () => {
		expect(lockedEncryptedScreen.contains(<PasswordPrompt />)).to.be.true
	})
	it('renders a new wallet button if the wallet is locked but not encrypted or unlocking', () => {
		expect(lockedUnencryptedScreen.contains(<NewWalletButton />)).to.be.true
	})
	it('renders unlocking text if wallet is unlocking', () => {
		expect(lockedEncryptedUnlockingScreen.text()).to.contain('Unlocking')
	})
})
