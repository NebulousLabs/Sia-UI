import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import Wallet from '../../plugins/Wallet/js/components/wallet.js'

const testActions = {
	startSendPrompt: spy(),
}

describe('wallet component', () => {
	afterEach(() => {
		testActions.startSendPrompt.reset()
	})
	it('should render balance info', () => {
		const walletComponent = shallow(<Wallet confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" />)
		expect(walletComponent.find('.balance-info').children()).to.have.length(2)
	})
	it('should render siafund balance when it is non-zero', () => {
		const walletComponent = shallow(<Wallet confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" />)
		expect(walletComponent.find('.balance-info').children()).to.have.length(3)
	})
	it('should render siacoin send button when siafund balance is zero', () => {
		const walletComponent = shallow(<Wallet confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" />)
		expect(walletComponent.find('SendButton')).to.have.length(1)
	})
	it('should start send prompt with siacoins when send siacoin button is clicked', () => {
		const walletComponent = shallow(<Wallet confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		walletComponent.find('SendButton').first().simulate('click')
		expect(testActions.startSendPrompt.calledWith('siacoins')).to.equal(true)
	})
	it('should start send prompt with siafunds when send siafunds button is clicked', () => {
		const walletComponent = shallow(<Wallet confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" actions={testActions} />)
		walletComponent.find('SendButton [currencytype="Siafund"]').first().simulate('click')
		expect(testActions.startSendPrompt.calledWith('siafunds')).to.equal(true)
	})
})