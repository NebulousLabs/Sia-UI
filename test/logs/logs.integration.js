import { logsPlugin } from '../../plugins/Logs/js/main.js'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { filters } from '../../plugins/Logs/js/filters.js'
import { parseLogs } from '../../plugins/Logs/js/logparse.js'

describe('logs plugin', () => {
	const rootComponent = mount(logsPlugin())
	it('has filters.length filtercomponents', () => {
		expect(rootComponent.find('FilterControl')).to.have.length(filters.length)
	})
	it('has each filter name', () => {
		const filterNames = rootComponent.find('FilterControl').map((node) => node.props().name)
		filters.forEach((filter) => {
			expect(filterNames.includes(filter.name)).to.equal(true)
		})
	})
	it('starts with consensus and gateway selected', () => {
		const filterStates = rootComponent.find('FilterControl').map((node) => ({ name: node.props().name, checked: node.props().checked}))
		filterStates.forEach((filter) => {
			if (filter.name === 'Consensus' || filter.name === 'Gateway') {
				expect(filter.checked).to.equal(true)
			} else {
				expect(filter.checked).to.equal(false)
			}
		})
	})
	it('starts with consensus and gateway logs shown', () => {
		expect(rootComponent.find('LogView').props().logText).to.equal(parseLogs(SiaAPI.config.siad.datadir, 50000, ['gateway.log', 'consensus.log']))
	})
	it('filters log view text when filter button is clicked', () => {
		const filterControlNodes = rootComponent.find('FilterControl')
		filterControlNodes.forEach((node) => {
			const filterFilters = filters.filter((f) => f.name === node.props().name)[0].filters
			node.simulate('click')
			expect(rootComponent.find('LogView').props().logText).to.equal(parseLogs(SiaAPI.config.siad.datadir, 50000, filterFilters))
		})
	})
})
