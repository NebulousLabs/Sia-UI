import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Path from 'path'
import SearchField from '../containers/searchfield.js'

const FileList = ({files, searchResults, path, showSearchField, actions}) => {

	const onFileClick = (file) => () => {
		if (file.type === 'directory') {
			actions.setPath(path + file.name + '/')
		} else {
			actions.showFileView(file)
		}
	}

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
		let fileIcon
		if (file.type === 'directory') {
			fileIcon = <i className="fa fa-folder"></i>
		} else {
			fileIcon = <i className="fa fa-file"></i>
		}
		return (
			<li key={key} onClick={onFileClick(file)}>
				<div>
					{fileIcon}
					<span className="filename">{file.name}</span>
				</div>
			</li>
		)
	})

	return (
		<div className="file-list">
			{showSearchField ? <SearchField /> : null}
			<ul>
				{path !== '' ? <li onClick={onBackClick}><div><i className="fa fa-backward"></i>Back</div></li> : null}
				{fileElements}
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
