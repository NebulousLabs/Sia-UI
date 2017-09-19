import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import UsageStats from '../../plugins/Files/js/components/usagestats.js'

describe('files usage stats component', () => {
	it('displays a spending bar with four sub-bars', () => {
		const component = shallow(<UsageStats allowance={100} downloadspending={10} uploadspending={10} storagespending={10} contractspending={10} />)
		expect(component.find('.spending-bar')).to.have.length(1)
		expect(component.find('.spending-bar').children()).to.have.length(4)
	})
	it('renders subbars with correct width attributes', () => {
		const component = shallow(<UsageStats allowance={100} downloadspending={6} uploadspending={5} storagespending={20} contractspending={10} />)
		expect(component.find('.download-spending').props().style).to.have.property('width', '6%')
		expect(component.find('.upload-spending').props().style).to.have.property('width', '5%')
		expect(component.find('.storage-spending').props().style).to.have.property('width', '20%')
		expect(component.find('.contract-spending').props().style).to.have.property('width', '10%')
	})
})
