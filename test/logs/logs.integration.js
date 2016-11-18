import { logsPlugin } from '../../plugins/Logs/js/main.js'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { filters } from '../../plugins/Logs/js/filters.js'
import { parseLogs } from '../../plugins/Logs/js/logparse.js'
import { Set } from 'immutable'

const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n))

describe('logs plugin', () => {
	const siadir = SiaAPI.config.siad.datadir
	const rootComponent = mount(logsPlugin())

	before(() => {
		// Set NODE_ENV to production to suppress react warnings
		// caused by externally triggering events on mounted components
		process.env.NODE_ENV = 'production'
	})
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
		expect(rootComponent.find('LogView').props().logText).to.equal(parseLogs(siadir, 50000, ['gateway.log', 'consensus.log']))
	})
	it('filters log view text when filter button is clicked', async () => {
		const filterControlNodes = rootComponent.find('FilterControl')

		for (let i = 0; i < filterControlNodes.length; i++) {
			const node = filterControlNodes.at(i)
			const filterFilters = filters.filter((f) => f.name === node.props().name)[0].filters
			node.simulate('click')
			await sleep(50)
			expect(rootComponent.find('LogView').props().logText).to.equal(parseLogs(siadir, 50000, filterFilters))
		}
	})
})
