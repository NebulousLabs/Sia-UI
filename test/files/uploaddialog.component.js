import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import UploadDialog from '../../plugins/Files/js/components/uploaddialog.js'

const testDialog = (files, isDir) => {
	const uploadFolderSpy = sinon.spy()
	const uploadFileSpy = sinon.spy()
	const hideUploadDialogSpy = sinon.spy()
	const testActions = {
		uploadFolder: uploadFolderSpy,
		uploadFile: uploadFileSpy,
		hideUploadDialog: hideUploadDialogSpy,
	}
	const UploadDialog = proxyquire('../../plugins/Files/js/components/uploaddialog.js', {
		fs: { statSync: () => ({ isDirectory: () => isDir }), '@noCallThru': true },
	}).default
	const uploadDialog = shallow(<UploadDialog actions={testActions} source={files} path="" />)
	uploadDialog.find('.upload-dialog-buttons').children().first().simulate('click')
	return {uploadFolderSpy, uploadFileSpy, uploadDialog}
}


describe('files upload dialog component', () => {
	it('correctly displays dialog for single file', () => {
		const testFiles = ['filename.png']
		const testResults = testDialog(testFiles)
		expect(testResults.uploadDialog.find('.upload-dialog').children('div').first().text()).to.equal(`Would you like to upload ${testFiles.length} ${testFiles.length === 1 ? 'item' : 'items'}?`)
		expect(testResults.uploadFolderSpy.callCount).to.equal(0)
		expect(testResults.uploadFileSpy.callCount).to.equal(testFiles.length)
		testFiles.forEach( (file) => {
			expect(testResults.uploadFileSpy.calledWith('', file)).to.be.true
		})
	})

	it('correctly displays dialog for multiple files', () => {
		const testFiles = ['filename.png', 'tomuch.meme', 'sia.sia.sia.sia.sia', '.sia.test']
		const testResults = testDialog(testFiles)
		expect(testResults.uploadDialog.find('.upload-dialog').children('div').first().text()).to.equal(`Would you like to upload ${testFiles.length} ${testFiles.length === 1 ? 'item' : 'items'}?`)
		expect(testResults.uploadFolderSpy.callCount).to.equal(0)
		expect(testResults.uploadFileSpy.callCount).to.equal(testFiles.length)
		testFiles.forEach( (file) => {
			expect(testResults.uploadFileSpy.calledWith('', file)).to.be.true
		})
	})

	it('correctly displays dialog for single folder', () => {
		const testFiles = ['folder']
		const testResults = testDialog(testFiles, true)
		expect(testResults.uploadDialog.find('.upload-dialog').children('div').first().text()).to.equal(`Would you like to upload ${testFiles.length} ${testFiles.length === 1 ? 'item' : 'items'}?`)
		expect(testResults.uploadFileSpy.callCount).to.equal(0)
		expect(testResults.uploadFolderSpy.callCount).to.equal(testFiles.length)
		testFiles.forEach( (file) => {
			expect(testResults.uploadFolderSpy.calledWith('', file)).to.be.true
		})
	})

	it('correctly displays dialog for multiple folders', () => {
		const testFiles = ['foldername', 'An amazing name', 'SIASIASIASIASIASIA', 'FTW']
		const testResults = testDialog(testFiles, true)
		expect(testResults.uploadDialog.find('.upload-dialog').children('div').first().text()).to.equal(`Would you like to upload ${testFiles.length} ${testFiles.length === 1 ? 'item' : 'items'}?`)
		expect(testResults.uploadFileSpy.callCount).to.equal(0)
		expect(testResults.uploadFolderSpy.callCount).to.equal(testFiles.length)
		testFiles.forEach( (file) => {
			expect(testResults.uploadFolderSpy.calledWith('', file)).to.be.true
		})
	})
})
