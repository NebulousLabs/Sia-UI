import React, { PropTypes } from 'react'

const File = ({filename, selected, filesize, onRenameClick, onDownloadClick, onDeleteClick, onSelect}) => (
	<li className={selected ? 'filebrowser-file selected' : 'filebrowser-file'} onClick={onSelect}>
		<div className="filename">
			<i className="fa fa-file" />
			<div className="name">{filename}</div>
		</div>
		<div className="file-info">
			<span className="filesize">{filesize}</span>
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
	filesize: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
	onRenameClick: PropTypes.func.isRequired,
	onDownloadClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
}

export default File
