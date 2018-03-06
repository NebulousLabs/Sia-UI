/* eslint-disable no-unused-expressions */
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
	it('renders a password input', () => {
		expect(passwordpromptComponent.find('input .password-input')).to.have.length(1)
		expect(passwordpromptComponent.find('input .password-input').first().prop('type')).to.equal('password')
	})
	it('renders a wallet unlock error', () => {
		expect(passwordpromptComponent.find('.password-prompt__error').first().text()).to.equal('')
		const erroredComponent = shallow(<PasswordPrompt password="testpw" error="testerror" />)
		expect(erroredComponent.find('.password-prompt__error').first().text()).to.equal('testerror')
	})
	it('calls unlockWallet with password on unlock button click', () => {
		passwordpromptComponent.find('.unlock-button').first().simulate('click')
		expect(testActions.unlockWallet.calledWith('testpw')).to.be.true
	})
	it('calls handlePasswordChange with new password on password input change', () => {
		passwordpromptComponent.find('.password-input').first().simulate('change', {target: { value: 'test-changed'}})
		expect(testActions.handlePasswordChange.calledWith('test-changed')).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
