import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import PasswordPrompt from '../../plugins/Wallet/js/components/passwordprompt.js'

const testActions = {
	handlePasswordChange: spy(),
	unlockWallet: spy(),
}

const passwordpromptComponent = shallow(<PasswordPrompt password="testpw" actions={testActions} />)

describe('wallet password prompt component', () => {
	it('calls unlockWallet with password on unlock button click', () => {
		passwordpromptComponent.find('.unlock-button').first().simulate('click')
		expect(testActions.unlockWallet.calledWith('testpw')).to.be.true
	})
	it('calls handlePasswordChange with new password on password input change', () => {
		passwordpromptComponent.find('.password-input').first().simulate('change', {target: { value: 'test-changed'}})
		expect(testActions.handlePasswordChange.calledWith('test-changed')).to.be.true
	})
})