import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { List } from 'immutable'
import TransactionList from '../../plugins/Wallet/js/components/transactionlist.js'
import BigNumber from 'bignumber.js'

const testTxns = List([
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid',
		confirmationtimestamp: 1000,
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(10),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid1',
		confirmationtimestamp: 1001,
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(10),
		},
		transactionid: 'testid2',
		confirmationtimestamp: 1002,
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(-10),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid3',
		confirmationtimestamp: 1003,
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(-10),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid4',
		confirmationtimestamp: 1004,
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(-10),
		},
		transactionid: 'testid5',
		confirmationtimestamp: 1005,
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(1),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid6',
		confirmationtimestamp: 1006,
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(-5),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid7',
		confirmationtimestamp: 1007,
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(1),
			totalMiner: new BigNumber(1),
		},
		transactionid: 'testid8',
		confirmationtimestamp: 1008,
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid9',
		confirmationtimestamp: 1009,
	},
])

const expectedValues = List([
	'10 SC ',
	'10 SF ',
	'10 SC (miner) ',
	'-10 SC ',
	'-10 SF ',
	'-10 SC (miner) ',
	'1 SC ',
	'10 SC -5 SF ',
	'10 SC 1 SF 1 SC (miner) ',
	'0 SC',
])

const txnlistComponent = shallow(<TransactionList transactions={testTxns} />)

describe('wallet transaction list component', () => {
	it('renders no recent transactions with an empty transaction list', () => {
		const emptytxnlist = shallow(<TransactionList transactions={List()} />)
		expect(emptytxnlist.find('.transaction-list').children()).to.have.length(1)
		expect(emptytxnlist.find('.transaction-list h3').first().text()).to.contain('No recent transactions')
	})
	it('renders a table with the correct length', () => {
		expect(txnlistComponent.find('.transaction-table tbody').children()).to.have.length(testTxns.size)
	})
	it('renders transaction net values correctly', () => {
		const txnnodes = txnlistComponent.find('.transaction-table tbody').children()
		for (let nodeindex = 0; nodeindex < txnnodes.length; nodeindex++) {
			expect(txnnodes.at(nodeindex).find('td').at(1).text()).to.equal(expectedValues.get(nodeindex))
		}
	})
	it('renders transaction ids correctly', () => {
		const txnnodes = txnlistComponent.find('.transaction-table tbody').children()
		for (let nodeindex = 0; nodeindex < txnnodes.length; nodeindex++) {
			expect(txnnodes.at(nodeindex).find('td').at(2).text()).to.equal(testTxns.get(nodeindex).transactionid)
		}
	})
	it('renders transaction confirmation icon correctly', () => {
		const txnnodes = txnlistComponent.find('.transaction-table tbody').children()
		for (let nodeindex = 0; nodeindex < txnnodes.length; nodeindex++) {
			if (testTxns.get(nodeindex).confirmed) {
				expect(txnnodes.at(nodeindex).find('.confirmed-icon')).to.have.length(1)
			} else {
				expect(txnnodes.at(nodeindex).find('.unconfirmed-icon')).to.have.length(1)
			}
		}
	})
})
