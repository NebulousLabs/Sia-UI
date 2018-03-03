import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { List } from 'immutable'
import { spy } from 'sinon'
import TransactionList from '../../plugins/Wallet/js/components/transactionlist.js'
import testTxns from './__fixtures__/transactions'

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

const testActions = {
	showMoreTransactions: spy(),
}

const txnlistComponent = shallow(<TransactionList transactions={testTxns} ntransactions={testTxns.size} />)

describe('wallet transaction list component', () => {
	it('renders no recent transactions with an empty transaction list', () => {
		const emptytxnlist = shallow(<TransactionList transactions={List()} ntransactions={0} />)
		expect(emptytxnlist.find('.transaction-list').children()).to.have.length(1)
		expect(emptytxnlist.find('.transaction-list h3').first().text()).to.contain('No recent transactions')
	})
	it('filters 0 SC transactions properly', () => {
		const filteredTxnList = shallow(<TransactionList transactions={testTxns} ntransactions={testTxns.size} filter />)
		const filteredNodes = filteredTxnList.find('.transaction-table tbody').children()
		for (let nodeindex = 0; nodeindex < filteredNodes.length; nodeindex++) {
			expect(filteredNodes.at(nodeindex).find('td').at(1).text()).to.not.equal('0 SC')
		}
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
	it('renders timestamps correctly', () => {
		const now = new Date()
		const timestamps = [
			now,
			new Date(2016, 5, 10, 3, 10),
			new Date(2015, 11, 5, 10, 30),
			new Date(2016, 2, 25, 6, 50),
		]
		const expectedTimestamps = [
			'Today at ' + now.getHours() + ':' + now.getMinutes(),
			'2016-06-10 03:10',
			'2015-12-05 10:30',
			'2016-03-25 06:50',
		]
		const txns = List(timestamps.map((timestamp) => ({
			confirmed: true,
			transactionsums: {
				totalSiacoin: new BigNumber(0),
				totalSiafund: new BigNumber(0),
				totalMiner: new BigNumber(0),
			},
			transactionid: 'testid',
			confirmationtimestamp: timestamp,
		})))

		const component = shallow(<TransactionList transactions={txns} />)
		const nodes = component.find('.transaction-table tbody').children()
		for (let nodeindex = 0; nodeindex < nodes.length; nodeindex++) {
			expect(nodes.at(nodeindex).find('td').at(0).text()).to.equal(expectedTimestamps[nodeindex])
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
	describe('pagination', () => {
		it('doesnt show load more transactions with transactions.size <= ntransactions', () => {
			expect(txnlistComponent.find('load-more-button')).to.have.length(0)
		})
		it('shows load more button when transactions.size > ntransactions', () => {
			const longtxnlist = shallow(<TransactionList ntransactions={5} transactions={testTxns} />)
			expect(longtxnlist.find('.load-more-button')).to.have.length(1)
		})
		it('loads more transactions when More Transactions is clicked', () => {
			const longtxnlist = shallow(<TransactionList ntransactions={5} transactions={testTxns} actions={testActions} />)
			longtxnlist.find('.load-more-button').first().simulate('click')
			expect(testActions.showMoreTransactions.called).to.equal(true)
		})
	})
})
