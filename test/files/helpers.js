import { expect } from 'chai'
import { uploadDirectory, rangeSelect, readableFilesize, ls } from '../../plugins/Files/js/sagas/helpers.js'
import { List, OrderedSet } from 'immutable'
import proxyquire from 'proxyquire'
import Path from 'path'
import * as actions from '../../plugins/Files/js/actions/files.js'

describe('files plugin helper functions', () => {
	it('returns sane values from readableFilesize', () => {
		const sizes = {
			1 : '1 B',
			1000 : '1 KB',
			10000 : '10 KB',
			100000 : '100 KB',
			1000000 : '1 MB',
			10000000 : '10 MB',
			100000000 : '100 MB',
			1000000000 : '1 GB',
			10000000000 : '10 GB',
			100000000000 : '100 GB',
			1000000000000 : '1 TB',
			10000000000000 : '10 TB',
			100000000000000 : '100 TB',
			1000000000000000 : '1 PB',
		}
		for (const bytes in sizes) {
			expect(readableFilesize(parseFloat(bytes))).to.equal(sizes[bytes])
		}
	})
	describe('directory upload', () => {
		const uploadDirectoryWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).uploadDirectory

		it('handles unix paths correctly', () => {
			const directoryTree = List([
				'/tmp/test/testfile.png',
				'/tmp/test/test_file.pdf',
				'/tmp/test/testdir/testfile.png',
				'/tmp/test/testdir/test.png',
			])
			expect(uploadDirectory('/tmp/test', directoryTree, 'testsiapath')).to.deep.equal(List([
				actions.uploadFile('testsiapath/test', '/tmp/test/testfile.png'),
				actions.uploadFile('testsiapath/test', '/tmp/test/test_file.pdf'),
				actions.uploadFile('testsiapath/test/testdir', '/tmp/test/testdir/testfile.png'),
				actions.uploadFile('testsiapath/test/testdir', '/tmp/test/testdir/test.png'),
			]))
		})
		it('handles windows paths correctly', () => {
			const directoryTree = List([
				'C:\\tmp\\test\\testfile.png',
				'C:\\tmp\\test\\test_file.pdf',
				'C:\\tmp\\test\\testdir\\testfile.png',
				'C:\\tmp\\test\\testdir\\test.png',
			])
			expect(uploadDirectoryWin32('C:\\tmp\\test', directoryTree, 'testsiapath')).to.deep.equal(List([
				actions.uploadFile('testsiapath/test', 'C:\\tmp\\test\\testfile.png'),
				actions.uploadFile('testsiapath/test', 'C:\\tmp\\test\\test_file.pdf'),
				actions.uploadFile('testsiapath/test/testdir', 'C:\\tmp\\test\\testdir\\testfile.png'),
				actions.uploadFile('testsiapath/test/testdir', 'C:\\tmp\\test\\testdir\\test.png'),
			]))
		})
	})
	describe('range selection', () => {
		const testFiles = List([
			{ siapath: 'test1' },
			{ siapath: 'test2' },
			{ siapath: 'test3' },
			{ siapath: 'test4' },
			{ siapath: 'test5' },
		])
		it('selects all from first -> last', () => {
			const selected = OrderedSet([
				{ siapath: 'test1' },
			])
			expect(rangeSelect(testFiles.last(), testFiles, selected).toArray()).to.deep.equal(testFiles.toArray())
		})
		it('selects all from last -> first', () => {
			const selected = OrderedSet([
				{ siapath: 'test5' },
			])
			expect(rangeSelect(testFiles.first(), testFiles, selected).toArray()).to.deep.equal(testFiles.reverse().toArray())
		})
		it('adds selections correctly top -> bottom', () => {
			const selected = OrderedSet([
				{ siapath: 'test2' },
			])
			const expectedSelection = [
				{ siapath: 'test2' },
				{ siapath: 'test3' },
			]
			expect(rangeSelect({ siapath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly bottom -> top', () => {
			const selected = OrderedSet([
				{ siapath: 'test4' },
			])
			const expectedSelection = [
				{ siapath: 'test4' },
				{ siapath: 'test3' },
				{ siapath: 'test2' },
			]
			expect(rangeSelect({ siapath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks top -> bottom', () => {
			let selected = OrderedSet([
				{ siapath: 'test1' },
			])
			let expectedSelection = [
				{ siapath: 'test1' },
				{ siapath: 'test2' },
				{ siapath: 'test3' },
			]
			expect(rangeSelect({ siapath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ siapath: 'test1' },
				{ siapath: 'test2' },
			]
			expect(rangeSelect({ siapath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks bottom -> top', () => {
			let selected = OrderedSet([
				{ siapath: 'test5' },
			])
			let expectedSelection = [
				{ siapath: 'test5' },
				{ siapath: 'test4' },
				{ siapath: 'test3' },
			]
			expect(rangeSelect({ siapath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ siapath: 'test5' },
				{ siapath: 'test4' },
			]
			expect(rangeSelect({ siapath: 'test4' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
	})
	it('should ls a file list correctly', () => {
		const lsWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).ls
		const siapathInputs = List([
			{ filesize: 1337, siapath: 'folder/file.jpg', redundancy: 2.0, available: true, uploadprogress: 100 },
			{ filesize: 13117, siapath: 'folder/file2.jpg', redundancy: 2.0, available: true, uploadprogress: 100 },
			{ filesize: 1237, siapath: 'rare_pepe.png', redundancy: 2.0, available: true, uploadprogress: 100 },
			{ filesize: 1317, siapath: 'memes/waddup.png', redundancy: 2.5, available: true, uploadprogress: 100 },
			{ filesize: 1337, siapath: 'memes/itsdatboi.mov', redundancy: 2.0, available: true, uploadprogress: 100 },
			{ filesize: 1337, siapath: 'memes/rares/lordkek.gif', redundancy: 1.6, available: true, uploadprogress: 100 },
			{ filesize: 13117, siapath: 'sibyl_system.avi', redundancy: 1.0, available: true, uploadprogress: 100 },
			{ filesize: 1331, siapath: 'doggos/borkborkdoggo.png', redundancy: 1.5, available: true, uploadprogress: 100 },
			{ filesize: 1333, siapath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', redundancy: 1.0, available: true, uploadprogress: 100 },
		])
		const expectedOutputs = {
			'': List([
				{ size: readableFilesize(1331+1333), name: 'doggos', siapath: 'doggos/', redundancy: 1.0, available: true, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1337+13117), name: 'folder', siapath: 'folder/', redundancy: 2.0, available: true, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1317+1337+1337), name: 'memes', siapath: 'memes/', redundancy: 1.6, available: true, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1237), name: 'rare_pepe.png', siapath: 'rare_pepe.png', redundancy: 2.0, available: true, uploadprogress: 100, type: 'file' },
				{ size: readableFilesize(13117), name: 'sibyl_system.avi', siapath: 'sibyl_system.avi', redundancy: 1.0, available: true, uploadprogress: 100, type: 'file' },
			]),
			'doggos/': List([
				{ size: readableFilesize(1331), name: 'borkborkdoggo.png', siapath: 'doggos/borkborkdoggo.png', redundancy: 1.5, available: true, uploadprogress: 100, type: 'file' },
				{ size: readableFilesize(1333), name: 'snip_snip_doggo_not_bork_bork_kind.jpg', redundancy: 1.0, siapath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', available: true, uploadprogress: 100, type: 'file' },
			]),
			'memes/': List([
				{ size: readableFilesize(1337), name: 'itsdatboi.mov', siapath: 'memes/itsdatboi.mov', redundancy: 2.0, available: true, uploadprogress: 100, type: 'file' },
				{ size: readableFilesize(1337), name: 'rares', siapath: 'memes/rares/', available: true, redundancy: 1.6, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1317), name: 'waddup.png', siapath: 'memes/waddup.png', available: true, redundancy: 2.5, uploadprogress: 100, type: 'file' },
			]),
		}
		for (const path in expectedOutputs) {
			const output = ls(siapathInputs, path)
			const outputWin32 = lsWin32(siapathInputs, path)
			expect(output).to.deep.equal(outputWin32)
			expect(output.size).to.equal(expectedOutputs[path].size)
			expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
		}
	})
})
