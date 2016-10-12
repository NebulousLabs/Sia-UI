import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'
import { expect } from 'chai'
import { spy } from 'sinon'
import FileList from '../../plugins/Files/js/components/filelist.js'

const testFiles = List([
	{size: '1337mb', name: 'hackers.mkv', type: 'file'},
	{size: '', name: 'movies', type: 'directory'},
	{size: '137mb', name: 'test.jpg', type: 'file'},
	{size: '137mb', name: 'meme.avi', type: 'file'},
	{size: '', name: 'dankpepes', type: 'directory'},
])

const files = testFiles.filter((file) => file.type === 'file')
const directories = testFiles.filter((file) => file.type === 'directory')

const testActions = {
	setPath: spy(),
	selectFile: spy(),
}

describe('file list', () => {
	it('renders a ul with the correct number of file and directory children', () => {
		const filelist = shallow(<FileList files={testFiles} selected={List()} showSearchField={false} path="" />)
		expect(filelist.find('File')).to.have.length(files.size)
		expect(filelist.find('Directory')).to.have.length(directories.size)
	})
	it('renders a back button when path is set', () => {
		expect(shallow(<FileList files={testFiles} showSearchField={false} selected={List()} path="movies/" />).find('ul').children()).to.have.length(testFiles.size + 1)
	})
	it('selects files', () => {
		const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={List()} path="" actions={testActions} />)
		filelist.find('File').first().simulate('click')
		expect(testActions.selectFile.calledWith(testFiles.get(0).name)).to.equal(true)
	})
	it('navigates directories', () => {
		let filelist = shallow(<FileList files={testFiles} selected={List()} showSearchField={false} path="test1/test2/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('test1/')).to.equal(true)

		filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={List()} path="test1/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('')).to.equal(true)

		const renderedDirectories = filelist.find('Directory')
		renderedDirectories.forEach((directory) => {
			directory.simulate('click')
			expect(testActions.setPath.calledWith('test1/' + directory.prop('name'))).to.equal(true)
		})
	})
})
