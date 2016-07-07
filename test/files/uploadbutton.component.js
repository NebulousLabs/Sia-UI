import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

import UploadButton from '../../plugins/Files/js/components/uploadbutton.js'

const siaOpenFilesArg = {
	title: 'Choose a file to upload',
	properties: ['openFile', 'multiSelections'],
}

const siaOpenFoldersArg = {
	title: 'Choose a file to upload',
	properties: ['openDirectory'],
}

const testButton = (files, isDir) => {
	const uploadSpy = sinon.spy()
	const testActions = {
		showUploadDialog: uploadSpy,
	}
	const openFileSpy = sinon.spy( () => files )
	global.SiaAPI = { openFile: openFileSpy }
	const uploadButton = shallow(<UploadButton actions={testActions} />)
	if (isDir) {
		uploadButton.find('.upload-button').at(1).simulate('click')
	} else {
		uploadButton.find('.upload-button').first().simulate('click')
	}
	return {uploadSpy, openFileSpy}
}

describe('files upload button component', () => {
	it('dispatches proper action for a single file upload', () => {
		const testFiles = ['filename.png']
		const spies = testButton(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(siaOpenFilesArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple file upload', () => {
		const testFiles = ['filename.png', 'file2.jpg', 'files3.pdf', 'cat.gifs']
		const spies = testButton(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(siaOpenFilesArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a single folder upload', () => {
		const testFolders = ['I am a folder.']
		const spies = testButton(testFolders, true)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFolders)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(siaOpenFoldersArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple folder upload', () => {
		const testFolders = ['Folders ', '987238479Holder', 'Yeah I\'m a folder.', 'Me too!']
		const spies = testButton(testFolders, true)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFolders)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(siaOpenFoldersArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('renders Forming Contracts... if there are not enough contracts', () => {
		expect(shallow(<UploadButton contracts={0} />).find('.upload-button-container span').first().text()).to.contain('Not Enough Contracts')
	})
})