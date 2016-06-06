import React, { PropTypes } from 'react'
import { List } from 'immutable'

const FileList = ({files}) => {
	const fileElements = files.map((file, key) => (
		<li key={key}>
			<span className="filename">{file.name}</span>
			<span className="filesize">{file.size}</span>
		</li>
	))
	return (
		<div className="file-list">
			<h2> Files </h2>
			<ul>
				{fileElements}
			</ul>
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
}

export default FileList
