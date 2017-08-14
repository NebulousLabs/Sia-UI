import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import ReceivePrompt from '../../plugins/Wallet/js/components/receiveprompt.js'

const testActions = {
	saveAddress: spy(),
	getNewReceiveAddress: spy(),
	setAddressDescription: spy(),
	hideReceivePrompt: spy(),
}

describe('wallet receive prompt component', () => {
	beforeEach(() => {
		for (const action in testActions) {
			testActions[action].reset()
		}
	})
	it('renders successfully', () => {
		const component = shallow(<ReceivePrompt address="testaddress" addresses={[]} />)
		expect(component.find('.receive-form')).to.have.length(1)
	})
	it('displayes prior addresses correctly', () => {
		const testAddrs = [
			{ description: 'testdesc', address: 'testaddr' },
			{ description: 'testdesc2', address: 'testaddr2' },
			{ description: 'testdesc3', address: 'testaddr3' },
		]
		const component = shallow(<ReceivePrompt address="testaddress" addresses={testAddrs} />)
		expect(component.find('.prior-address')).to.have.length(testAddrs.length)
		component.find('.prior-address').forEach((node, i) => {
			expect(node.find('.description').text()).to.equal(testAddrs[(testAddrs.length-1)-i].description)
			expect(node.find('.address').text()).to.equal(testAddrs[(testAddrs.length-1)-i].address)
		})
	})
	it('saves addresses correctly', () => {
		const component = shallow(<ReceivePrompt description="recv-addr" address="testaddress" addresses={[]} actions={testActions} />)
		component.find('.save-address-button').simulate('click')
		expect(testActions.saveAddress.calledWith({
			description: 'recv-addr',
			address: 'testaddress',
		})).to.equal(true)
	})
	it('gets new addresses correctly', () => {
		const component = shallow(<ReceivePrompt description="recv-addr" address="testaddress" addresses={[]} actions={testActions} />)
		expect(testActions.getNewReceiveAddress.called).to.equal(false)
		component.find('.new-address-button').simulate('click')
		expect(testActions.getNewReceiveAddress.called).to.equal(true)
	})
	it('hides when done is clicked', () => {
		const component = shallow(<ReceivePrompt description="recv-addr" address="testaddress" addresses={[]} actions={testActions} />)
		component.find('.done-button').simulate('click')
		expect(testActions.hideReceivePrompt.called).to.equal(true)
	})
})

