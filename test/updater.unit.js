import proxyquire from 'proxyquire'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'

let version = 'v1.0.2'
let remoteVersion = 'v1.0.2'

const mock = {
	request: (uri, callback) => {
		callback(null, null, [
			{
				tag_name: remoteVersion,
			},
		])
	},
	electron: {
		shell: {
			openExternal: spy(),
		}
	}
}

const Update = proxyquire('../js/rendererjs/update.js', mock).default

describe('update checker component', () => {
	it('displays update available if remote version is greater than local version', async () => {
		version = 'v1.0.0'
		remoteVersion = 'v1.0.2'
		const updateComponent = shallow(await Update(version))
		expect(updateComponent.find('.version-status-text').text()).to.contain('Update Available')
	})
	it('calls electron.shell.openExternal on click if remote version is greater than local', async () => {
		version = 'v1.0.0'
		remoteVersion = 'v1.0.2'
		const updateComponent = shallow(await Update(version))
		updateComponent.find('.updater-component').simulate('click')
		expect(mock.electron.shell.openExternal.called).to.be.true
	})
	it('does not display update available if remote version matches local version', async () => {
		version = 'v1.0.2'
		remoteVersion = 'v1.0.2'
		const updateComponent = shallow(await Update(version))
		expect(updateComponent.find('.version-status-text')).to.have.length(0)
	})
})


