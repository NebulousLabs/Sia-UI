/* eslint-disable no-unused-expressions */

import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import FileBrowser from '../../plugins/Files/js/components/filebrowser.js'

const testDrag = (files) => {
	const uploadSpy = sinon.spy()
	const notDraggingSpy = sinon.spy()
	const testActions = {
		showUploadDialog: uploadSpy,
		setNotDragging: notDraggingSpy,
	}
	const fileBrowser = shallow(<FileBrowser dragging={false} showRenameDialog={false} showUploadDialog={false} showDeleteDialog={false} showFileTransfers={false} actions={testActions} />)
	fileBrowser.find('.file-browser').first().simulate('drop', {
		dataTransfer: {
			files: files.map((file) => ({ path: file })),
		},
		preventDefault: () => undefined,
	})
	return {uploadSpy, notDraggingSpy}
}

describe('files drag upload', () => {
	it('dispatches proper action for a single file drag upload', () => {
		const testFiles = ['filename.png']
		const spies = testDrag(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.notDraggingSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple file drag upload', () => {
		const testFiles = ['filename.png', 'another file name.har', 'yesStillAnotherName.wohoo']
		const spies = testDrag(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.notDraggingSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a single folder drag upload', () => {
		const testFiles = ['Awesome Folder']
		const spies = testDrag(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.notDraggingSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple folder drag upload', () => {
		const testFiles = ['An amazing Folder', 'Another Amazing Folder', 'Still Another More Amazing Folder']
		const spies = testDrag(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.notDraggingSpy.calledOnce).to.be.true
	})
})

/* eslint-enable no-unused-expressions */
