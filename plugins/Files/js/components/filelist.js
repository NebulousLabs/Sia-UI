import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Path from 'path'

const FileList = ({files, path, actions}) => {
	const onFileClick = (file) => () => {
		if (file.type === 'directory') {
			actions.setPath(path + file.name + '/')
		}
	}
	const onBackClick = () => {
		if (path === '' || path === '../') {
			return
		}
		let newpath = Path.join(path, '../')
		if (newpath === './') {
			newpath = ''
		}
		actions.setPath(newpath)
	}

	const fileElements = files.map((file, key) => {
		let fileIcon
		if (file.type === 'directory') {
			fileIcon = <i className="fa fa-folder"></i>
		} else {
			fileIcon = <i className="fa fa-file"></i>
		}
		return (
			<li key={key} onClick={onFileClick(file)}>
				{fileIcon}
				<span className="filename">{file.name}</span>
				<span className="filesize">{file.size}</span>
			</li>
		)
	})
	return (
		<div className="file-list">
			<h2> Files </h2>
			<button className="file-back-button" onClick={onBackClick}>Back</button>
			<ul>
				{fileElements}
			</ul>
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
	path: PropTypes.string.isRequired,
}

export default FileList
