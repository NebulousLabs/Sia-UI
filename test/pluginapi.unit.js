import { expect } from 'chai'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import proxyquire from 'proxyquire'
import React from 'react'
import DisabledPlugin from '../js/rendererjs/disabledplugin.js'

let running = true
const mock = {
	'react-dom': {
		render: sinon.spy(),
	},
	'sia.js': {
		ifRunning: (is, not) => {
			if (running) {
				is()
			} else {
				not()
			}
		},
		start: sinon.spy(),
	},
	'electron': {
		remote: {
			getCurrentWindow: sinon.spy(),
			getGlobal: (name) => {
				if (name === 'config') {
					return {
						siad: {
							path: 'testpath/siad',
							datadir: 'testpath/datadir',
							detached: false,
						}
					}
				}
			},
			dialog: {
				showOpenDialog: sinon.spy(),
				showSaveDialog: sinon.spy(),
				showMessageBox: sinon.spy(),
				showErrorBox: sinon.spy(),
			}
		}
	}
}

proxyquire('../js/rendererjs/pluginapi.js', mock)

describe('plugin API', () => {
	it('creates a SiaAPI window object', () => {
		expect(window.SiaAPI).to.exist
	})
	it('does not mount disabled plugin component if siad is running', function(done) {
		running = true
		this.timeout(10000)
		setTimeout(() => {
			expect(mock['react-dom'].render.called).to.be.false
			done()
		}, 2000)
	})
	it('mounts disabled plugin if siad is not running', function(done) {
		running = false
		this.timeout(10000)
		setTimeout(() => {
			expect(mock['react-dom'].render.called).to.be.true
			expect(mock['react-dom'].render.calledWith(<DisabledPlugin startSiad={mock['sia.js'].start} />, document.body)).to.be.true
			done()
		}, 2000)
	})
	describe('DisabledPlugin component', () => {
		it('calls siajs.start on click', () => {
			const component = shallow(<DisabledPlugin startSiad={mock['sia.js'].start} />)
			component.find('button').first().simulate('click')
			expect(mock['sia.js'].start.called).to.be.true
		})
	})
})
