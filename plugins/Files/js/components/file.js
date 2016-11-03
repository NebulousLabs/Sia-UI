import React, { PropTypes } from 'react'
import RedundancyStatus from './redundancystatus.js'


const File = ({filename, type, selected, filesize, available, redundancy, onDoubleClick, onRenameClick, onDownloadClick, onDeleteClick, onClick, onRedundancyClick}) => (
	<li
		onClick={onClick}
		onDoubleClick={onDoubleClick}
		className={selected ? 'filebrowser-file selected' : 'filebrowser-file'}
	>
		<div className="filename">
			{type === 'file' ? <i className="fa fa-file" /> : <i className="fa fa-folder" onClick={onDoubleClick} />}
			<div className="name">{filename}</div>
		</div>
		<div className="file-info">
			<span className="filesize">{filesize}</span>
			{type === 'file' ? <RedundancyStatus available={available} redundancy={redundancy} onRedundancyClick={onRedundancyClick} /> : null}
			<div className="file-buttons">
				<div onClick={onRenameClick} className="rename-button">
					<i className="fa fa-pencil 2x" />
				</div>
				<div onClick={onDownloadClick} className="download-button">
					<i className="fa fa-cloud-download 2x" />
				</div>
				<div onClick={onDeleteClick} className="delete-button">
					<i className="fa fa-trash 2x" />
				</div>
			</div>
		</div>
	</li>
)

File.propTypes = {
	filename: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	filesize: PropTypes.string.isRequired,
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number,
	selected: PropTypes.bool.isRequired,
	onRenameClick: PropTypes.func.isRequired,
	onDownloadClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default File
