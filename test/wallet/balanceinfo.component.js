import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import BalanceInfo from '../../plugins/Wallet/js/components/balanceinfo.js'

describe('wallet balance info component', () => {
	it('renders balance info', () => {
		const component= shallow(<BalanceInfo synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info').children()).to.have.length(2)
		expect(component.find('.balance-info__main-balance').text()).to.contain('10')
		expect(component.find('.balance-info__unconfirmed-balance').text()).to.contain('1 SC')
	})
	it('renders siafund balance when it is non-zero', () => {
		const component = shallow(<BalanceInfo synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info__addendum').children()).to.have.length(1)
		expect(component.find('.balance-info__addendum').children().first().text()).to.contain('Siafund Balance: 1 SF')
	})
	it('renders a warning when not synced', () => {
		const component = shallow(<BalanceInfo synced={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info').children()).to.have.length(3)
		expect(component.find('.balance-info').children().last().text()).to.contain('Your wallet is not synced, balances are not final.')
	})
})
