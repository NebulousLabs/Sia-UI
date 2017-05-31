import { expect } from 'chai'
import fs from 'fs'
import proxyquire from 'proxyquire'

const mock = {
	'electron': {
		'app': {
			getPath: () => './',
		},
		'@noCallThru': true,
	},
}
const loadConfig = proxyquire('../js/mainjs/config.js', mock).default

describe('config.js', () => {
	afterEach(() => {
		try {
			fs.unlinkSync('test.json')
		} catch (err) {
			console.error('error cleaning up test: ', err.toString())
		}
	})
	it('loads the default config successfully when an invalid path is given', () => {
		loadConfig('/invalid/path')
	})
	it('saves and loads the config successfully when a valid path is given', () => {
		const config = loadConfig('test.json')
		config.save()
		const config2 = loadConfig('test.json')
		expect(config2).to.deep.equal(config)
	})
})


