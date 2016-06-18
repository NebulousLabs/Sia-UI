import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const FilesList = ({ files, actions }) => {
	const addStorageLocation = (e) => actions.addFolder(helper.chooseFileLocation())
	const removeStorageLocation = (file) => actions.deleteFolder(file)
	//const addStorageLocation = (e) => actions.addFile(helper.chooseFileLocation())

	const FileList = files.map((file, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-3-4">
				<div className="name">{ file.get("path") }</div>
			</div>
			<div className="pure-u-1-12">
				<div>{ file.get("free").toString() } GB</div>
			</div>
			<div className="pure-u-1-12">
				<div>{ file.get("size").toString() } GB</div>
			</div>
			<div className='pure-u-1-24' onClick={ function (){ removeStorageLocation(file) } }>
				<div><i className='fa fa-edit'></i></div>
			</div>
			<div className='pure-u-1-24'>
				<div><i className='fa fa-remove'></i></div>
			</div>
		</div>
	)).toList()

	return (
		<div className="files section">
			<div className="property row">
				<div className="title"></div>
				<div className="controls">
					<div className='button left' id='edit' onClick={ addStorageLocation }>
						<i className='fa fa-folder-open'></i>
						&nbsp;Add Storage Folder
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
