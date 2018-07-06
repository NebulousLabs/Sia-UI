import { expect } from 'chai'
import fs from 'fs'
import proxyquire from 'proxyquire'
import { version } from '../package.json'

const mock = {
	'electron': {
		'app': {
			getPath: () => './',
		},
		'@noCallThru': true,
	},
}
const loadConfig = proxyquire('../js/mainjs/config.js', mock)

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
	it('sets the default siad path if the config version is undefined', () => {
		const config = loadConfig('test.json')
		const defaultSiadPath = config.siad.path
		config.version = undefined
		config.siad.path = '/test/siad/path'
		config.save()
		const config2 = loadConfig('test.json')
		expect(config2.siad.path).to.equal(defaultSiadPath)
		expect(config2.version).to.equal(version)
	})
	it('sets the default siad path if the config version is outdated', () => {
		const config = loadConfig('test.json')
		const defaultSiadPath = config.siad.path
		config.version = '1.2.0'
		config.siad.path = '/test/siad/path'
		config.save()
		const config2 = loadConfig('test.json')
		expect(config2.siad.path).to.equal(defaultSiadPath)
		expect(config2.version).to.equal(version)
		config2.siad.path = '/test/new/path'
		config2.save()
		const config3 = loadConfig('test.json')
		expect(config3.siad.path).to.equal('/test/new/path')
	})
})


