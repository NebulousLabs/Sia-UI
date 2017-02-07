/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import Wallet from '../../plugins/Wallet/js/components/wallet.js'
import ReceiveButton from '../../plugins/Wallet/js/containers/receivebutton.js'
import ReceivePrompt from '../../plugins/Wallet/js/containers/receiveprompt.js'
import NewWalletDialog from '../../plugins/Wallet/js/containers/newwalletdialog.js'
import TransactionList from '../../plugins/Wallet/js/containers/transactionlist.js'
import SendPrompt from '../../plugins/Wallet/js/containers/sendprompt.js'

const testActions = {
	startSendPrompt: spy(),
}

describe('wallet component', () => {
	afterEach(() => {
		testActions.startSendPrompt.reset()
	})
	it('renders balance info', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" />)
		expect(walletComponent.find('.balance-info').children()).to.have.length(2)
		expect(walletComponent.find('.balance-info').children().first().text()).to.contain('Confirmed Balance: 10 SC')
		expect(walletComponent.find('.balance-info').children().last().text()).to.contain('Unconfirmed Delta: 1 SC')
	})
	it('renders siafund balance when it is non-zero', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" />)
		expect(walletComponent.find('.balance-info').children()).to.have.length(3)
		expect(walletComponent.find('.balance-info').children().last().text()).to.contain('Siafund Balance: 1 SF')
	})
	it('renders a warning when not synced', () => {
		const walletComponent = shallow(<Wallet synced={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" />)
		expect(walletComponent.find('.balance-info').children()).to.have.length(3)
		expect(walletComponent.find('.balance-info').children().last().text()).to.contain('Your wallet is not synced, balances are not final.')
	})
	it('renders siacoin send button when siafund balance is zero', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" />)
		expect(walletComponent.find('SendButton')).to.have.length(1)
	})
	it('renders start send prompt with siacoins when send siacoin button is clicked', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		walletComponent.find('SendButton').first().simulate('click')
		expect(testActions.startSendPrompt.calledWith('siacoins')).to.be.true
	})
	it('renders start send prompt with siafunds when send siafunds button is clicked', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" actions={testActions} />)
		walletComponent.find('SendButton [currencytype="Siafund"]').first().simulate('click')
		expect(testActions.startSendPrompt.calledWith('siafunds')).to.be.true
	})
	it('renders a transaction list', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<TransactionList />)).to.be.true
	})
	it('renders a receive button', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceiveButton />)).to.be.true
	})
	it('does not render show new wallet dialog unless showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.false
	})
	it('renders show new wallet dialog when showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.true
	})
	it('does not render show send prompt unless showSendPrompt', () => {
		const walletComponent = shallow(<Wallet synced showSendPrompt={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<SendPrompt />)).to.be.false
	})
	it('renders show send prompt when showSendPrompt', () => {
		const walletComponent = shallow(<Wallet synced showSendPrompt confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<SendPrompt />)).to.be.true
	})
	it('does not render show receive prompt unless showReceivePrompt', () => {
		const walletComponent = shallow(<Wallet synced showReceivePrompt={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceivePrompt />)).to.be.false
	})
	it('renders show receive prompt when showReceivePrompt', () => {
		const walletComponent = shallow(<Wallet synced showReceivePrompt confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceivePrompt />)).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
