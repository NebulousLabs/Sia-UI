import React from 'react'

const AddFolderButton = ({actions}) => {
	const handleClick = () => actions.showAddFolderDialog()
	return (
		<div onClick={handleClick} className="addfolder-button">
			<i className="fa fa-folder fa-2x" />
			<span> Add Folder </span>
		</div>
	)
}

export default AddFolderButton 
