import { expect } from 'chai'
import { parseUploads, readableFilesize, ls } from '../../plugins/Files/js/sagas/helpers.js'
import { List } from 'immutable'

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
	it('should ls a file list correctly', () => {
		const siapathInputs = List([
			{ filesize: 1337, siapath: 'folder/file.jpg', available: true, uploadprogress: 100 },
			{ filesize: 13117, siapath: 'folder/file2.jpg', available: true, uploadprogress: 100 },
			{ filesize: 1237, siapath: 'rare_pepe.png', available: true, uploadprogress: 100 },
			{ filesize: 1317, siapath: 'memes/waddup.png', available: true, uploadprogress: 100 },
			{ filesize: 1337, siapath: 'memes/itsdatboi.mov', available: true, uploadprogress: 100 },
			{ filesize: 1337, siapath: 'memes/rares/lordkek.gif', available: true, uploadprogress: 100 },
			{ filesize: 13117, siapath: 'sibyl_system.avi', available: true, uploadprogress: 100 },
			{ filesize: 1331, siapath: 'doggos/borkborkdoggo.png', available: true, uploadprogress: 100 },
			{ filesize: 1333, siapath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', available: true, uploadprogress: 100 },
		])
		const expectedOutputs = {
			'': List([
				{ size: '', name: 'doggos', siapath: 'doggos/', available: true, uploadprogress: 100, type: 'directory' },
				{ size: '', name: 'folder', siapath: 'folder/', available: true, uploadprogress: 100, type: 'directory' },
				{ size: '', name: 'memes', siapath: 'memes/', available: true, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1237), name: 'rare_pepe.png', siapath: 'rare_pepe.png', available: true, uploadprogress: 100, type: 'file' },
				{ size: readableFilesize(13117), name: 'sibyl_system.avi', siapath: 'sibyl_system.avi', available: true, uploadprogress: 100, type: 'file' },
			]),
			'doggos/': List([
				{ size: readableFilesize(1331), name: 'borkborkdoggo.png', siapath: 'doggos/borkborkdoggo.png', available: true, uploadprogress: 100, type: 'file' },
				{ size: readableFilesize(1333), name: 'snip_snip_doggo_not_bork_bork_kind.jpg', siapath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', available: true, uploadprogress: 100, type: 'file' },
			]),
			'memes/': List([
				{ size: readableFilesize(1337), name: 'itsdatboi.mov', siapath: 'memes/itsdatboi.mov', available: true, uploadprogress: 100, type: 'file' },
				{ size: '', name: 'rares', siapath: 'memes/rares/', available: true, uploadprogress: 100, type: 'directory' },
				{ size: readableFilesize(1317), name: 'waddup.png', siapath: 'memes/waddup.png', available: true, uploadprogress: 100, type: 'file' },
			]),
		}
		for (const path in expectedOutputs) {
			const output = ls(siapathInputs, path)
			expect(output.size).to.equal(expectedOutputs[path].size)
			expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
		}
	})
	it('filters uploads correctly in parseUploads', () => {
		expect(parseUploads([
			{uploadprogress: 50, siapath: 'test', available: true},
			{uploadprogress: 50, siapath: 'test', available: true},
			{uploadprogress: 100, siapath: 'test', available: true},
			{uploadprogress: 100, siapath: 'test', available: true},
		]).size).to.equal(2)
		expect(parseUploads([
			{uploadprogress: 100, siapath: 'test', available: true},
			{uploadprogress: 100, siapath: 'test', available: true},
			{uploadprogress: 100, siapath: 'test', available: true},
			{uploadprogress: 100, siapath: 'test', available: true},
		]).size).to.equal(0)
		expect(parseUploads([
			{uploadprogress: 99.8, siapath: 'test', available: true},
			{uploadprogress: 99.5, siapath: 'test', available: true},
			{uploadprogress: 50, siapath: 'test', available: true},
			{uploadprogress: 50, siapath: 'test', available: true},
		]).size).to.equal(2)
	})
})

