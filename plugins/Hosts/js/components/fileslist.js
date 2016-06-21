import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const FilesList = ({ folders, actions }) => {
	const addStorageLocation = (e) => actions.addFolderAskPathSize()
	const removeStorageLocation = (folder) => actions.removeFolder(folder)
	const resizeStorageLocation = (folder) => actions.resizeFolder(folder)

	const FileList = folders.map((folder, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-3-4">
				<div className="name">{ folder.get("path") }</div>
			</div>
			<div className="pure-u-1-12">
				<div>{ folder.get("free").toString() } GB</div>
			</div>
			<div className="pure-u-1-12">
				<div>{ folder.get("size").toString() } GB</div>
			</div>
			<div className='pure-u-1-24' onClick={ function (){ resizeStorageLocation(folder) } }>
				<div><i className='fa fa-edit button'></i></div>
			</div>
			<div className='pure-u-1-24' onClick={ function (){ removeStorageLocation(folder) } }>
				<div><i className='fa fa-remove button'></i></div>
			</div>
		</div>
	)).toList()

	return (
		<div className="files section">
			<div className="property row">
				<div className="title"></div>
				<div className="controls full">
					<div className='button left' id='edit' onClick={ addStorageLocation }>
						<i className='fa fa-folder-open'></i>
						Add Storage Folder
					</div>
					<div className='pure-u-1-12' style={{ "textAlign": "left" }}>Free</div>
					<div className='pure-u-1-12' style={{ "textAlign": "left" }}>Max Size</div>
					<div className='pure-u-1-12'></div>
				</div>
			</div>
			{ FileList }
		</div>
	)
}

export default FilesList
