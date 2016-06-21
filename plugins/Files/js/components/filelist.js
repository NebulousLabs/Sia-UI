import React, { PropTypes } from 'react'
import { List } from 'immutable'
import File from './file.js'
import Directory from './directory.js'
import Path from 'path'
import SearchField from '../containers/searchfield.js'

const FileList = ({files, searchResults, path, showSearchField, actions}) => {

	const onDirectoryClick = (directory) => () => actions.setPath(path + directory.name + '/')
	const onBackClick = () => {
		if (path === '') {
			return
		}
		let newpath = Path.join(path, '../')
		if (newpath === './') {
			newpath = ''
		}
		actions.setPath(newpath)
	}

	let filelistFiles
	if (showSearchField) {
		filelistFiles = searchResults
	} else {
		filelistFiles = files
	}

	const fileElements = filelistFiles.map((file, key) => {
		if (file.type === 'directory') {
			return (
				<Directory key={key} onClick={onDirectoryClick(file)} name={file.name} />
			)
		}
		const onDownloadClick = () => {
			const downloadpath = SiaAPI.openFile({
				title: 'Where should we download this file?',
				properties: ['openDirectory', 'createDirectories'],
			})
			actions.downloadFile(file.siapath, Path.join(downloadpath[0], Path.basename(file.siapath)))
		}
		const onDeleteClick = () => actions.showDeleteDialog(file.siapath)
		return (
			<File key={key} filename={file.name} filesize={file.size} onDownloadClick={onDownloadClick} onDeleteClick={onDeleteClick} />
		)
	})
	return (
		<div className="file-list">
			{showSearchField ? <SearchField /> : null}
			<ul>
				{path !== '' ? <li onClick={onBackClick}><div><i className="fa fa-backward"></i>Back</div></li> : null}
				{fileElements.size > 0 ? fileElements : <h2> No files have been uploaded! </h2>}
			</ul>
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
	searchResults: PropTypes.instanceOf(List),
	path: PropTypes.string.isRequired,
	showSearchField: PropTypes.bool.isRequired,
}

export default FileList
