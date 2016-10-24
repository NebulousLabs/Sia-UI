import React, { PropTypes } from 'react'

const File = ({filename, type, selected, filesize, onIconClick, onRenameClick, onDownloadClick, onDeleteClick, onClick}) => (
	<li onClick={onClick} className={selected ? 'filebrowser-file selected' : 'filebrowser-file'}>
		<div className="filename">
			{type === 'file' ? <i className="fa fa-file" /> : <i className="fa fa-folder" onClick={onIconClick} />}
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
	type: PropTypes.string.isRequired,
	filesize: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
	onRenameClick: PropTypes.func.isRequired,
	onDownloadClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	onIconClick: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default File
