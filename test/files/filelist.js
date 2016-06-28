import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'
import { expect } from 'chai'
import { spy } from 'sinon'
import FileList from '../../plugins/Files/js/components/filelist.js'

const testFiles = List([
	{size: '1337mb', name: 'hackers.mkv', type: 'file'},
	{size: '11337mb', name: 'movies', type: 'directory'},
	{size: '137mb', name: 'test.jpg', type: 'file'},
	{size: '137mb', name: 'meme.avi', type: 'file'},
	{size: '8008gb', name: 'dankpepes', type: 'directory'},
])

const files = testFiles.filter((file) => file.type === 'file')
const directories = testFiles.filter((file) => file.type === 'directory')

const testActions = {
	setPath: spy(),
}

describe('file list', () => {
	it('renders a ul with the correct number of file and directory children', () => {
		const filelist = shallow(<FileList files={testFiles} path="" />)
		expect(filelist.find('File')).to.have.length(files.size)
		expect(filelist.find('Directory')).to.have.length(directories.size)
	})
	it('renders a back button when path is set', () => {
		expect(shallow(<FileList files={testFiles} path="movies/" />).find('ul').children()).to.have.length(testFiles.size + 1)
	})
	it('navigates directories', () => {
		let filelist = shallow(<FileList files={testFiles} path="test1/test2/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('test1/')).to.equal(true)

		filelist = shallow(<FileList files={testFiles} path="test1/" actions={testActions} />)
		filelist.find('ul').children().first().simulate('click')
		expect(testActions.setPath.calledWith('')).to.equal(true)

		const renderedDirectories = filelist.find('Directory')
		renderedDirectories.forEach((directory) => {
			directory.simulate('click')
			expect(testActions.setPath.calledWith('test1/' + directory.prop('name'))).to.equal(true)
		})
	})
})
