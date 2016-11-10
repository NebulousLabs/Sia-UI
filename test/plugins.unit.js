import Path from 'path'
import { getPluginName, getOrderedPlugins } from '../js/rendererjs/plugins.js'
import { expect } from 'chai'

const pluginDir = Path.join(__dirname, '../plugins')
const nPlugins = 6

describe('plugin system', () => {
	describe('getOrderedPlugins', () => {
		it('returns an array of the correct length', () => {
			expect(getOrderedPlugins(pluginDir, 'Files').size).to.equal(nPlugins)
		})
		it('has About plugin last', () => {
			expect(getPluginName(getOrderedPlugins(pluginDir, 'Files').last())).to.equal('About')
		})
		it('has home plugin first', () => {
			expect(getPluginName(getOrderedPlugins(pluginDir, 'Files').first())).to.equal('Files')
		})
		it('has terminal plugin second-to-last', () => {
			const plugins = getOrderedPlugins(pluginDir, 'Files')
			expect(getPluginName(plugins.get(plugins.size - 2))).to.equal('Terminal')
		})
	})
})
