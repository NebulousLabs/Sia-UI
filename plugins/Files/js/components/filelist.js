import React, { PropTypes } from 'react'
import { List } from 'immutable'
import File from './file.js'
import Directory from './directory.js'
import Path from 'path'
import SearchField from '../containers/searchfield.js'

const FileList = ({files, selected, searchResults, path, showSearchField, actions}) => {
	const onDirectoryClick = (directory) => () => actions.setPath(Path.join(path, directory.name))
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
		const onRenameClick = () => actions.showRenameDialog(file.siapath)
		const onDownloadClick = () => {
			const downloadpath = SiaAPI.openFile({
				title: 'Where should we download this file?',
				properties: ['openDirectory', 'createDirectories'],
			})
			actions.downloadFile(file.siapath, Path.join(downloadpath[0], Path.basename(file.siapath)))
		}
		const onDeleteClick = () => actions.showDeleteDialog(file.siapath)
		const onFileClick = () => actions.selectFile(file.siapath)
		return (
			<File key={key} selected={selected.includes(file.siapath)} filename={file.name} filesize={file.size} onRenameClick={onRenameClick} onDownloadClick={onDownloadClick} onDeleteClick={onDeleteClick} onSelect={onFileClick} />
		)
	})
	return (
		<div className="file-list">
			{showSearchField ? <SearchField /> : null}
			<ul>
				{path !== '' ? <li onClick={onBackClick}><div><i className="fa fa-backward" />Back</div></li> : null}
				{fileElements.size > 0 ? fileElements : (showSearchField ? <h2> No matching files </h2> : <h2> No files uploaded </h2>)}
			</ul>
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
	selected: PropTypes.instanceOf(List).isRequired,
	searchResults: PropTypes.instanceOf(List),
	path: PropTypes.string.isRequired,
	showSearchField: PropTypes.bool.isRequired,
}

export default FileList
