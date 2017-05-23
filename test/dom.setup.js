import { jsdom } from 'jsdom'
import Path from 'path'

const testdir = Path.resolve('./test/logs/testdir')
const exposedProperties = ['window', 'navigator', 'document']

global.HTMLElement = function() {}
global.document = jsdom('')
global.window = document.defaultView
global.SiaAPI = {
	config: {
		siad: {
			datadir: testdir,
		},
	},
}

Object.keys(document.defaultView).forEach((property) => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property)
		global[property] = document.defaultView[property]
	}
})

global.navigator = {
	userAgent: 'node.js',
}
