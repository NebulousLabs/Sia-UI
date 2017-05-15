import PropTypes from 'prop-types'
import React from 'react'
import RedundancyStatus from './redundancystatus.js'

const File = ({filename, type, selected, filesize, available, redundancy, uploadprogress, onDoubleClick, onClick}) => (
	<li onClick={onClick} onDoubleClick={onDoubleClick} className={selected ? 'filebrowser-file selected' : 'filebrowser-file'}>
		<div className="filename">
			{type === 'file' ? <i className="fa fa-file" /> : <i className="fa fa-folder" onClick={onDoubleClick} />}
			<div className="name">{filename}</div>
		</div>
		<div className="file-info">
			<span className="filesize">{filesize}</span>
			<RedundancyStatus available={available} redundancy={redundancy} uploadprogress={uploadprogress} />
		</div>
	</li>
)

File.propTypes = {
	filename: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	filesize: PropTypes.string.isRequired,
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number,
	uploadprogress: PropTypes.number,
	selected: PropTypes.bool.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default File
