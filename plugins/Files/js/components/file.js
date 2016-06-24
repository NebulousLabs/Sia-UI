import React, { PropTypes } from 'react'

const File = ({filename, filesize, onDownloadClick, onDeleteClick}) => (
	<li>
		<div className="filename">
			<i className="fa fa-file"></i>
			<div className="name">{filename}</div>
		</div>
		<div className="file-info">
			<span className="filesize">{filesize}</span>
			<div className="file-buttons">
				<div onClick={onDownloadClick} className="download-button">
					<i className="fa fa-cloud-download 2x"></i>
				</div>
				<div onClick={onDeleteClick} className="delete-button">
					<i className="fa fa-trash 2x"></i>
				</div>
			</div>
		</div>
	</li>
)

File.propTypes = {
	filename: PropTypes.string.isRequired,
	filesize: PropTypes.string.isRequired,
	onDownloadClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
}

export default File
