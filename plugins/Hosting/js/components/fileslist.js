import React from 'react'
import { Map } from 'immutable'

const FilesList = ({ folders, actions }) => {
	const addStorageLocation = () => actions.addFolderAskPathSize()
	const removeStorageLocation = (folder) => actions.showWarning(Map({
		title: 'Delete storage folder?',
		message: 'No longer use this folder for storage? You may loose collateral if you do not have enough space to fill all contracts.',
	}), () => actions.removeFolder(folder))

	const onResizeStorageLocationClick = (folder) => () => actions.resizeFolder(folder)
	const onRemoveStorageLocationClick = (folder) => () => removeStorageLocation(folder)

	const FileList = folders.map((folder, key) => (
		<div className="property pure-g" key={key}>
			<div className="pure-u-3-4">
				<div className="name">{folder.get('path')}</div>
			</div>
			<div className="pure-u-1-12">
				<div>{folder.get('free').toString()} GB</div>
			</div>
			<div className="pure-u-1-12">
				<div>{folder.get('size').toString()} GB</div>
			</div>
			<div className="pure-u-1-24" onClick={onResizeStorageLocationClick(folder)}>
				<div><i className="fa fa-edit button"></i></div>
			</div>
			<div className="pure-u-1-24" onClick={onRemoveStorageLocationClick(folder)}>
				<div><i className="fa fa-remove button"></i></div>
			</div>
		</div>
	)).toList()

	return (
		<div className="files section">
			<div className="property row">
				<div className="title"></div>
				<div className="controls full">
					<div className="button left" id="edit" onClick={addStorageLocation}>
						<i className="fa fa-folder-open"></i>
						Add Storage Folder
					</div>
					<div className="pure-u-1-12" style={{ 'textAlign': 'left' }}>Free</div>
					<div className="pure-u-1-12" style={{ 'textAlign': 'left' }}>Max</div>
					<div className="pure-u-1-12"></div>
				</div>
			</div>
			{FileList}
		</div>
	)
}

export default FilesList
