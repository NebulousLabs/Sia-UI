import React from 'react'
import { shallow } from 'enzyme'
import { List, Set } from 'immutable'
import { expect } from 'chai'
import { spy } from 'sinon'
import FileList from '../../plugins/Files/js/components/filelist.js'

const testFiles = List([
	{size: '1337mb', name: 'hackers.mkv', siapath: 'movies/hackers.mkv', type: 'file'},
	{size: '', name: 'movies', type: 'directory'},
	{size: '137mb', name: 'test.jpg', siapath: 'test.jpg', type: 'file'},
	{size: '137mb', name: 'meme.avi', siapath: 'meme.avi', type: 'file'},
	{size: '', name: 'dankpepes', type: 'directory'},
])

const files = testFiles.filter((file) => file.type === 'file')
const directories = testFiles.filter((file) => file.type === 'directory')

const testActions = {
	setPath: spy(),
	selectFile: spy(),
	deselectFile: spy(),
	deselectAll: spy(),
}

describe('file list', () => {
	beforeEach(() => {
		for (const action in testActions) {
			testActions[action].reset()
		}
	})
	it('renders a ul with the correct number of file and directory children', () => {
		const filelist = shallow(<FileList files={testFiles} selected={Set()} showSearchField={false} path="" />)
		expect(filelist.find('File')).to.have.length(files.size)
		expect(filelist.find('Directory')).to.have.length(directories.size)
	})
	it('renders a back button when path is set', () => {
		expect(shallow(<FileList files={testFiles} showSearchField={false} selected={Set()} path="movies/" />).find('ul').children()).to.have.length(testFiles.size + 1)
	})
	describe('file selection', () => {
		it('selects files', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={Set()} path="" actions={testActions} />)
			const filenodes = filelist.find('File')
			for (let nodeindex = 0; nodeindex < filenodes.length; nodeindex++) {
				filenodes.at(nodeindex).simulate('click', { ctrlKey: false })
				expect(testActions.deselectAll.called).to.equal(true)
				expect(testActions.selectFile.calledWith(files.get(nodeindex).siapath)).to.equal(true)
			}
		})
		it('selects multiple files with shift key', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={Set()} path="" actions={testActions} />)
			const filenodes = filelist.find('File')
			for (let nodeindex = 0; nodeindex < filenodes.length; nodeindex++) {
				filenodes.at(nodeindex).simulate('click', { ctrlKey: true })
				expect(testActions.deselectAll.called).to.equal(false)
				testActions.deselectAll.reset()
				expect(testActions.selectFile.calledWith(files.get(nodeindex).siapath)).to.equal(true)
			}
		})
		it('deselects a file when selected and shift-clicked', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={Set([files.get(0).siapath, files.get(1).siapath])} path="" actions={testActions} />)
			const filenodes = filelist.find('File')
			filenodes.at(0).simulate('click', { ctrlKey: true })
			expect(testActions.deselectFile.calledWith(files.get(0).siapath)).to.equal(true)
		})
		it('exclusively selects a file with multiple selected and no shift click', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={Set([files.get(0).siapath, files.get(1).siapath])} path="" actions={testActions} />)
			const filenodes = filelist.find('File')
			filenodes.at(1).simulate('click', { ctrlKey: false})
			expect(testActions.deselectAll.called).to.equal(true)
			expect(testActions.selectFile.calledWith(files.get(1).siapath)).to.equal(true)
		})
	})
	it('navigates directories', () => {
		let filelist = shallow(<FileList files={testFiles} selected={Set()} showSearchField={false} path="test1/test2/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('test1/')).to.equal(true)

		filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={Set()} path="test1/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('')).to.equal(true)

		const renderedDirectories = filelist.find('Directory')
		renderedDirectories.forEach((directory) => {
			directory.simulate('click')
			expect(testActions.setPath.calledWith('test1/' + directory.prop('name'))).to.equal(true)
		})
	})
})
